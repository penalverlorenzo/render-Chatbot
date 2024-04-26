import Boom  from "@hapi/boom";
import { promptModel } from "../models/prompt.model.js";
import { config } from "../config/index.js";
import { HfInference } from "@huggingface/inference";


export class PromptServices {
  async getAll() {
    try {
      const data = await promptModel.find();
      return data;
    } catch (error) {
      throw new Boom.badRequest(error);
    }
  };

  async dataComparison(message, dataString) {
    const hf = new HfInference(config.iaKey);
    const response = await hf.questionAnswering({
      model: 'deepset/roberta-base-squad2',
      inputs: {
        question: message,
        context: dataString
      }
    })
    return response
  }

  
  async promptGeneration(prom, dataString) {
    const message = prom + "?";
    try {
      const resFormat = 'Answer: ' || 'answer: '
      // Se crea instancia de huggin face con nuestro access token de hugging face
    const hf = new HfInference(config.iaKey);

    const promptDeCh = `
    Instrucciones Generales:

    Rol del Agente: tu eres "Kike" un agente IA actuarás como una interfaz entre los usuarios y la base de datos de la empresa.
    Nombre del Agente: "Kike".

    Capacidad de Respuesta:
    Interacción con los Usuarios: Debe responder esto ${message} de manera profesional y precisa.
    Datos de la Base de Datos: Utiliza esta información ${dataString} en nuestra base de datos para proporcionar respuestas precisas y relevantes.

    Gestión de Preguntas:
    Preguntas Coherentes: Responde a las preguntas de los usuarios de manera coherente y precisa utilizando la información proporcionada en la base de datos.
    Preguntas Incoherentes: Si el agente detecta una pregunta incoherente, debe informar al usuario que su pregunta no es coherente y brindar orientación adicional si es necesario.
    Respuestas de No Disponibilidad: Si el agente no tiene la información solicitada en la base de datos, debe informar al usuario que la información solicitada no está disponible en el momento.

    Estilo de Respuesta:
    Tono Profesional: Todas las respuestas deben mantener un tono profesional y respetuoso.
    `
      // Se crea la primer prommpt, esta prompt está encargada de darle un contexto y hacer que la IA genere una respuesta
    const firstPrompt = await hf.textGeneration({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      parameters: {details: false, decoder_input_details: false, return_full_text: false, do_sample: false, temperature: 0.1, best_of: 1, repetition_penalty: 1.2},
      inputs: promptDeCh
      ,
    });
  
    
    //  Traemos la respuesta de la primer prompt
    const firstPromptRes = firstPrompt.generated_text.replaceAll('\n', '');
      return firstPromptRes;
    } catch (error) {
      throw new Error(`EN: There's something wrong, try sending your message again. ESP: Se ha producido un error, intenta enviar tu mensaje de vuelta: ${error}`)
    }
  }


  async postResponse(res, payload){
    try {
      const data = await this.getAll();
      const dataPrev = data.map(item => {
        const {_id, ...Data } = item; 
        return Data._doc.Data;
      })
      const dataString = JSON.stringify(dataPrev);
      
      const message = payload.message;

      const response = await this.promptGeneration(message, dataString);
      return res.json({response});
    } catch (error) {
      return res.status(400).json({error: error.message})
    }
  }
}
