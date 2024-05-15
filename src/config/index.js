import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  mongodbURL: process.env.MONGODB_URL,
  iaKey: process.env.IA_KEY,
  hostIA: process.env.HOST_IA,
  jwtSecret: process.env.JWT_SECRET,
  redisPassword: process.env.REDIS_PASSWORD,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};

