import { Mistral } from "@mistralai/mistralai";
import { config } from '../config.js';

export const mistral = new Mistral({
  apiKey: config.mistral.apiKey,
});