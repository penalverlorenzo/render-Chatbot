import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3001,
  mongodbURL: process.env.MONGODB_URL,
  iaKey: process.env.IA_KEY
};

