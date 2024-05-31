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
async createItem(key, value){
    const response = await client.set(key, value, {EX: 300})
    return response
}
async updateItem(key, value){
    const response = await client.APPEND(key, value)
    return response
}
async getItem(key){
    const response = await client.get(key)
    return response
}
async isMemoryFull (token){
    const memoryInfo = await client.info('memory')
    const totalMemoryMatch =  memoryInfo.match(/used_memory:(\d+)/);
    const totalMemory =  totalMemoryMatch? parseInt(totalMemoryMatch[1], 10) : 0;
    const userHistoryMemory = await client.memoryUsage(token)
    if ( (totalMemory/250) < userHistoryMemory ) {
        return true
    }else{
        return false
    }
}
async deleteItem (token){
    const response = await client.DEL(token)
    return response
}
}
