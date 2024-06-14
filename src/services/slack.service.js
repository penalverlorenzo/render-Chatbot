export class SlackServices {
  constructor(client) {
    this.slackClient = client;
  }
  async postMessage({message, channelId}) {
    // console.log({message, channelId});
    try {
      const res = await this.slackClient.chat.postMessage({ 
        channel: channelId, 
        text: message,
        // thread_ts: '1718311747.599019'
      });
      console.log('Message sen succesfuly: ',res);
      return res;
    } catch (error) {
      console.error('Error sending mensaje: ', error);
      throw error;
    }
  }
}