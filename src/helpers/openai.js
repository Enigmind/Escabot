import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config.js';

const configuration = new Configuration({
  apiKey: config.openAi.apiKey,
});

export const openai = new OpenAIApi(configuration);
