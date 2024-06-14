import { SlackServices } from "../services/slack.service.js";
import { config } from "../config/index.js";
import { slackClient } from "../libs/slack.js";

const slackServices =  new SlackServices(slackClient);

const { slack: { channelId } } = config;
export const slackController = async (req, res, next)=>{
  try {
    const { message } = req.body;
    const response = await slackServices.postMessage({message, channelId});
    console.log(response);
    next()
  } catch (error) {
    throw new Error(error)
  }
};