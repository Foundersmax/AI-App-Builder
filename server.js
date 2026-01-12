
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI is not defined in environment variables.");
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Database Schema
const SiteSchema = new mongoose.Schema({
  metadata: {
    title: { type: String, required: true },
    description: String,
    primaryColor: String,
    fontFamily: String,
  },
  sections: [{
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: String,
    html: { type: String, required: true },
  }],
}, { timestamps: true });

const Site = mongoose.model('Site', SiteSchema);

// Gemini AI Config - using Gemini 3 Pro for world-class design
const SITE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        primaryColor: { type: Type.STRING },
        fontFamily: { type: Type.STRING },
      },
      required: ['title', 'description', 'primaryColor', 'fontFamily']
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING },
          title: { type: Type.STRING },
          html: { type: Type.STRING, description: "Valid HTML string with Tailwind classes. No wrapper needed." },
        },
        required: ['id', 'type', 'title', 'html']
      }
    }
  },
  required: ['metadata', 'sections']
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a master of modern web design and a senior Tailwind CSS developer.
Goal: Generate a high-performance, visually stunning landing page.
Rules:
1. Use semantic HTML5.
2. Use Tailwind CSS for 100% of the styling.
3. Ensure sections are responsive (use lg:, md:, etc.).
4. Use high-quality placeholders from https://picsum.photos/ with descriptive sizes (e.g., /800/600).
5. Aesthetics: Clean, modern, plenty of whitespace, bold typography.
6. Return a valid JSON object matching the provided schema.
`;

// AI Generation Helper
const runAiGeneration = async (contents) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: SITE_SCHEMA,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return JSON.parse(response.text);
};

// --- API Routes ---

app.get('/api/health', (req, res) => res.json({ status: 'ok', engine: 'Gemini 3 Pro' }));

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(`Generating site for: ${prompt}`);
    const result = await runAiGeneration(`Build a complete landing page for this business/idea: ${prompt}`);
    res.json(result);
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: 'AI engine failed to produce a valid design. Please retry.' });
  }
});

app.post('/api/refine', async (req, res) => {
  try {
    const { currentSite, instruction } = req.body;
    console.log(`Refining site with instruction: ${instruction}`);
    const result = await runAiGeneration(`
      Update the following website based on user feedback.
      Feedback: "${instruction}"
      Existing Website: ${JSON.stringify(currentSite)}
    `);
    res.json(result);
  } catch (error) {
    console.error('Refinement Error:', error);
    res.status(500).json({ error: 'Failed to refine the current design.' });
  }
});

app.post('/api/sites', async (req, res) => {
  try {
    const { _id, ...siteData } = req.body;
    let site;
    if (_id && mongoose.Types.ObjectId.isValid(_id)) {
      site = await Site.findByIdAndUpdate(_id, siteData, { new: true });
    } else {
      site = await Site.create(siteData);
    }
    res.json(site);
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ error: 'Could not save project to MongoDB Atlas.' });
  }
});

app.get('/api/sites', async (req, res) => {
  try {
    const sites = await Site.find().sort({ createdAt: -1 }).limit(6);
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Lumina Backend active on port ${PORT}`));
