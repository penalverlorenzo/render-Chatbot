import { threadModel } from "../models/thread.model.js";

export class SlackServices {
  constructor(client) {
    this.slackClient = client;
  }

  async sendNewMessage({ message, channelId, sessionId }) {
    try {
      const res = await this.slackClient.chat.postMessage({
        channel: channelId,
        text: message,
      });
      await this.createThread(sessionId, res.message.ts)
      // console.log(res.message.ts)
      return res;
    } catch (error) {
      console.error('Error sending mensaje: ', error);
      throw error;
    }
  }
  
  async sendMessageToThread({message, channelId, ts}) {
    try {
      const res = await this.slackClient.chat.postMessage({
        channel: channelId,
        text: message,
        thread_ts: ts
      });
      // console.log('Message send succesfuly: ', res);
      return res;
    } catch (error) {
      console.error('Error sending mensaje: ', error);
      throw error;
    }
  }

  async getThread (sessionId){
    try {
      const thread = await threadModel.findOne({sessionId});
      return thread;
    } catch (error) {
      console.log('error al buscar el thread: ', error)
      throw error
    }
  }

  async createThread (sessionId, ts ) {
    try {
      const newThread =  await threadModel.create({sessionId, ts})
      return newThread;
    } catch (error) {
      console.log('error al crear el thread: ', error);
      throw error;
    }
  }
  async handleMessage ({sessionId, message, channelId}) {
    console.log('Hola se está ejecutandfo el handle message');
    try {
      const thread = await this.getThread(sessionId);
      if (!thread) {
        const newMessage = await this.sendNewMessage({message, channelId, sessionId});
        return newMessage;
      }
      const newMessageToThread = this.sendMessageToThread({message, channelId, ts: thread.ts});
      return newMessageToThread;
    } catch (error) {
      
    }
  }
}

// new SlackServices(slackClient).getThread('1234')
// // new SlackServices(slackClient).createTread('1234', '1234')
//   .then(res => console.log(res))
//   .catch(e => console.log(e))