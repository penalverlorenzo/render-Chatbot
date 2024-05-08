import { createClient } from 'redis';
import { config } from "../config/index.js";
const client = createClient({
    password: config.redisPassword,
    socket: {
        host: 'redis-18030.c1.asia-northeast1-1.gce.redns.redis-cloud.com',
        port: 18030
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
