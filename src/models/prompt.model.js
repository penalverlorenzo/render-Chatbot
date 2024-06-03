import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const promptSchema = new Schema({

    // data: {type: String, required: true}, 
    // Dentro de data van a ver un un objeto en dondw va a tener tola informacion.

    massage: { type: String, require: true }
});

export const promptModel = model("info", promptSchema)

export const promptPrivateModel = model("info_private", promptSchema)

const historySchema = new Schema({
    historyId: {type: String, required: true}, 
    history: { type: Array, require: true },
    // response: { type: Array, require: true }
});

export const historyModel = model("history", historySchema)



