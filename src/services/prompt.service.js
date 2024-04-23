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
    const hf = new HfInference(config.accessToken);
    const response = await hf.questionAnswering({
      model: 'deepset/roberta-base-squad2',
      inputs: {
        question: message,
        context: dataString
      }
    })
    return response
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

      const response = await this.dataComparison(message, dataString);

      return res.json(response);
    } catch (error) {
      console.error(error);
    }
  }
}
