import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  mongodbURL: process.env.MONGODB_URL,
  iaKey: process.env.IA_KEY,
  hostIA: process.env.HOST_IA,
};

