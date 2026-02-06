import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';

// Pour le chat (ancien SDK)
export const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// Pour la génération d'images et vidéos (nouveau SDK)
export const genAIMedia = new GoogleGenAI({ apiKey: config.gemini.apiKey });
