import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const promptSchema = new Schema({

    // data: {type: String, required: true}, 
    // Dentro de data van a ver un un objeto en dondw va a tener tola informacion.

    massage: { type: String, require: true }
});

export const promptModel = model("info", promptSchema)

const redisSchema = new Schema({

    // data: {type: String, required: true}, 
    // Dentro de data van a ver un un objeto en dondw va a tener tola informacion.
    key: { type: String, require: true },
    value: { type: String, require: true }
});

export const redisModel = model("redis", redisSchema)



