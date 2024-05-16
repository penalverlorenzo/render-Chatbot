import { createClient } from 'redis';
import { config } from "../config/index.js";
const client = createClient({
    password: config.redisPassword,
    socket: {
        host: config.redisHost,
        port: config.redisPort
    }
});
const clientRedis = await client.connect()

export class RedisServices {
async createItem(value,key){
    const response = await client.set(key, value, {EX: 86400})
    return response
}
async getItem(key){
    const response = await client.get(key)
    return response
}
}
