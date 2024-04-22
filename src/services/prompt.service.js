import Boom  from "@hapi/boom";
import { promptModel } from "../models/prompt.model.js";

export class PromptServices {
  getAll(res) {
    try {
      const prompt = promptModel.find({}).then(data => {
        return res.json(data)
      });
      return prompt;
    } catch (error) {
      throw new Boom.badRequest(error);
    }
  };
  createInfo(res,payload){
    try {
      const prompt = promptModel(payload)
        const info = prompt.save().then(data => res.json(data))
        .catch(e => res.status(400).json(Boom.badRequest(e)))
      return info
    } catch (error) {
      console.error(error);
    }
  }
}
