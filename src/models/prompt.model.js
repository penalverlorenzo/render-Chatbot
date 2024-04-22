import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const promptSchema = new Schema({
    type: {type: String, required: true}, // Tipo para identificar el principal motivo de busqueda de la solicitud ej: Contactos, Info especifica, etc.
    description: {type: String, required: true}, // Para ayudar a la IA a analizar la info de la data, para que sepa identificar para que es, ej: Info de contacto del CEO
    data: {type: String, required: true}, // Los datos que vamos a retornar, ej: Un email o numero de telefono
});

export const promptModel = model("info", promptSchema)



