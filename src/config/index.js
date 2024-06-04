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
  tokenWtspp: process.env.TOKEN_WTSPP,
  redisPort: process.env.REDIS_PORT,
  pineconeToken: process.env.PINECONE_DB_TOKEN,
  openaiKey: process.env.OPENAI_API_KEY,
  wspAccessToken: process.env.WSP_ACCESS_TOKEN,
  wspURL: process.env.WSP_URL
};


