import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

export const userModel = model("users", userSchema)
