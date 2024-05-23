import { createClient } from 'redis';
import { config } from "../config/index.js";
const client = createClient({
    password: config.redisPassword,
    socket: {
        host: config.redisHost,
        port: config.redisPort
    }
});
await client.connect()

export class RedisServices {
async createItem(value,key, exp){
    const response = await client.set(key, value, {EX: exp})
    return response
}
async updateItem(value, key){
    const response = await client.APPEND(key, value)
    console.log({"Updating Item": response});
    return response
}
async getItem(key){
    const response = await client.get(key)
    return response
}
}
