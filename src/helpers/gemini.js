import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from '../config.js';

export const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
