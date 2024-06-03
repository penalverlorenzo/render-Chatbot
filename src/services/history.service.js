import { historyModel } from '../models/prompt.model.js';

export class HistoryServices {
    async updateHistory(id, message, response){
        const res = await historyModel.findOneAndUpdate({historyId: id},{$push:{history: {question: message, response: response}}})
        return res
    }
    async createHistory (id, message, response){
        const res = await historyModel.create({historyId: id, history: [{question: message, response: response}]})
        return res
    }
}