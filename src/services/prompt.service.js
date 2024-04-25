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

  
  async promptGeneration(message, dataString) {
    try {
      const resFormat = 'Answer: ' || 'answer: '
      // Se crea instancia de huggin face con nuestro access token de hugging face
    const hf = new HfInference(config.iaKey);
      // Se crea la primer prommpt, esta prompt está encargada de darle un contexto y hacer que la IA genere una respuesta
    const firstPrompt = await hf.textGeneration({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      parameters: {details: false, decoder_input_details: false, return_full_text: false, do_sample: false, temperature: 0.1, best_of: 1, repetition_penalty: 1.2},
      inputs: `Context: I am a user with questions or curiosities about this data: ${dataString}.
      Persona: You are an AI agent named Nogadev. Your name is Kike, and your purpose is to provide information.
      Tone: Respond in a professional tone.
      Task: Analyze the message with the provided data given in the context, your output must be a coherent answer. If the data doesn't contain the information to answer your output must be an error message with the following format: "Answer: (response)".
      Task: detect_incoherent_message("${message}"). If the question is incoherent, respond with "This question is not coherent" with the following format: "Answer: (response)". If it is coherent, respond to these prompts ${message} in the language they were sent, using the provided data. 
    
      Output: Your output must be a JSON file in this format: "Answer: (response)"
      
      `
      ,
    });
    //  Traemos la respuesta de la primer prompt
    const firstPromptRes = firstPrompt.generated_text;
    // En la prompt se le dió un output específico para que retorne, estas expresiones regulares detectan ese output
    const firstPromptRegex = /{\n\s+"answer": "([^"]+)"\n\s+}/;
    const firstPromptRegex2 = /{\n\s+"answer": ([^"]+)\n\s+}/
    // Hay 2 posibles respuestas que puede dar la IA con "" o sin, se hace match para 2 posibles casos
    const firstPromptMatch = firstPromptRes.match(firstPromptRegex);
    const firstPromptMatch2 = firstPromptRes.match(firstPromptRegex2);
    // Si el primer match de la regex 1 da como resultado null significa que no encontró con la estructura especificada, entonces vamos al .input del match 2 (Ya que el match 1 es null) y hacemos que haga un split de 'Answer: ' y tomamos el segundo index que trae la respuesta ['Answer: ', ...] 
    const firstPromptMatchInput = firstPromptMatch === null? firstPromptMatch2.input.split(resFormat)[1].split('\n')[0]: firstPromptMatch[1]
    // Se crea una segunda prompt que recibe la prompt anterior, esta está encargada de recibir la data, la prompt y el resultado de la firstPrompt, compara la prompt y el resultado, si el resultado tiene sentido te lo devuelve, sino te lo rechaza.
    const secondPrompt = await hf.textGeneration({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      parameters: {details: false, decoder_input_details: false, return_full_text: false, do_sample: false, temperature: 0.1, best_of: 1, repetition_penalty: 1.2},
      inputs: `Context: I will give you a data: ${dataString}, a message: ${message} and a res: ${firstPromptMatchInput}.
      Persona: You are an AI agent named Nogadev. Your name is Kike, and your purpose is to compare the message with the res using the given data as context.
      Tone: Respond in a professional tone.
      Task: Your task is to compare the message and the res given in the context, use the data and verify if the res answers correctly the message, if it does then your output must be the res with the following format: "Answer: (response)".
      Error: If the task is incorrect then you must provide an error message with the following format: "Answer: (response)". Before giving the error message check and analyze again the task.
      Format: Provide responses to prompts in this format: "Answer: (response)".
      Output: Your output must be a JSON file
      `
      ,
    })

    // Se le usa la mísma lógica que en la firstPrompt
    const secondPromptRes = secondPrompt.generated_text;
    const secondPromptRegex = /{\n\s+"answer": "([^"]+)"\n\s+}/;
    const secondPromptRegex2 = /{\n\s+"answer": ([^"]+)\n\s+}/
    const secondPromptMatch = secondPromptRes.match(secondPromptRegex);
    const secondPromptMatch2 = secondPromptRes.match(secondPromptRegex2);   
    const secondPromptMatchInput = secondPromptMatch === null? secondPromptMatch2.input.split(resFormat)[1].split('\n')[0]: secondPromptMatch[1]
    return secondPromptMatchInput
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
