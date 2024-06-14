import { WebClient } from '@slack/web-api';
import { config } from '../config/index.js';

const { slack: { token } } = config;
export const slackClient = new WebClient(token);