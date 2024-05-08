import { createClient } from 'redis';
import { config } from "../config/index.js";
const client = createClient({
    password: config.redisPassword,
    socket: {
        host: 'redis-15293.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
        port: 15293
    }
});
await client.connect()

export class RedisServices {
async createItem(value,key, res){
    const response = await client.set(key, value, {EX: 86400})
    return response
}
async getItem(id, res){
    const response = await client.get(id)
    return response
}
}
