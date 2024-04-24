import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbURL: process.env.MONGODB_URL,
  accessToken: process.env.API_TOKEN
};

