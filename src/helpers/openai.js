import OpenAI from 'openai';
import { config } from '../config.js';



export const openai = new OpenAI({
  apiKey: config.openAi.apiKey,
});
