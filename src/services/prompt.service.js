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
    const hf = new HfInference(config.iaKey);
    const response = await hf.textGeneration({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      parameters: {details: false, decoder_input_details: false, return_full_text: false, do_sample: false, temperature: 0.1},
      inputs: `
      detect_incoherent_message("${message}") "Answer: Sorry, you must send a valid question"
      Your name is kike, you should use this data ${dataString} to answer the following question ${message}, I want the answer with the following structure "Answer: "` ,
    })
    const text = response.generated_text;
    console.log({"text": text});
    const regex = /Answer: "(.*?)"/;
    const regex2 = /Answer: (.*?)/;
    const match = text.match(regex);
    const match2 = text.match(regex2);
    
    const matchInput = match === null? match2.input.split('Answer: ')[1].split('\n')[0]: match[1] 
    return matchInput
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
      console.error(error);
    }
  }
}
