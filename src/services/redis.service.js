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
    const usedMemoryMatch =  memoryInfo.match(/used_memory:(\d+)/);
    const usedMemory =  usedMemoryMatch? parseInt(usedMemoryMatch[1], 10) : 0;
    // const maxMemory = 2 * 1024 * 1024
    const userHistoryMemory = await client.memoryUsage(token)
    console.log({memoryInfo, usedMemory});
    if (usedMemory < userHistoryMemory) {
        return true
    }else{
        // console.log({memoryInfo, usedMemory});
        return false
    }
}
async emptyMemory (token){
    const response = await client.DEL(token)
    return response
}
}
