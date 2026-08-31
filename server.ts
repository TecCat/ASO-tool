import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Generate Complete Slide Deck Copy (ASO Story Arc)
app.post('/api/ai/generate-deck', async (req, res) => {
  try {
    const {
      appName,
      appCategory,
      appDescription,
      targetAudience,
      slideCount = 5,
      language = 'zh-TW',
      tone = 'apple-minimal',
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
You are an expert iOS App Store Optimization (ASO) and Conversion Copywriter.
Create a high-converting ${slideCount}-slide App Store screenshot story arc for the following iOS application:

App Name: ${appName || 'My App'}
Category: ${appCategory || 'Productivity & Utility'}
Target Audience: ${targetAudience || 'iOS users'}
App Key Value & Features: ${appDescription || 'A beautifully designed iOS app'}
Tone/Style: ${tone} (e.g. apple-minimal, bold-action, emotional-benefit, data-driven, social-proof)
Language: ${language} (zh-TW: Traditional Chinese, en: English, ja: Japanese, etc.)

Guidelines for App Store Screenshots:
1. Slide 1 (Hero/Hook): Must grab attention in < 2 seconds. Focus on the #1 ultimate benefit or pain killer.
2. Subsequent Slides: Highlight distinct core features, speed/simplicity, insights/customization, privacy/trust, or rating proof.
3. Headlines must be punchy (under 6-9 words in English, under 10-14 chars in Chinese).
4. Subtitles provide supporting proof or explain "How it works" in 1 concise line.
5. Provide high-impact badge tag suggestion (e.g. "NEW", "★ 4.9 RATED", "FEATURED", "ULTRA FAST", "OFFLINE FIRST").
6. Provide an ASO conversion rationale explaining why this copy converts visitors into downloads.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a world-class App Store screenshot copywriter who maximizes click-through and download conversion rates for top iOS apps.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appStorylineSummary: {
              type: Type.STRING,
              description: 'Brief 1-sentence summary of the visual screenshot strategy.',
            },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideIndex: { type: Type.INTEGER },
                  badge: { type: Type.STRING, description: 'Short badge like ★ 4.9, NEW, 100% PRIVATE' },
                  headline: { type: Type.STRING, description: 'Punchy headline' },
                  subtitle: { type: Type.STRING, description: 'Clear supporting subtitle' },
                  featureFocus: { type: Type.STRING, description: 'Which UI feature to showcase on this slide' },
                  asoTip: { type: Type.STRING, description: 'Why this copy converts & targeted keyword' },
                },
                required: ['slideIndex', 'headline', 'subtitle', 'featureFocus', 'asoTip'],
              },
            },
          },
          required: ['appStorylineSummary', 'slides'],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating deck copy:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate copy suggestions',
    });
  }
});

// API: Suggest Copy Variations for a Single Slide
app.post('/api/ai/suggest-variations', async (req, res) => {
  try {
    const {
      currentHeadline,
      currentSubtitle,
      appName,
      category,
      featureContext,
      language = 'zh-TW',
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Generate 4 distinct high-converting App Store screenshot copy variations for an iOS screenshot:

Context:
App: ${appName || 'App'} (${category || 'iOS App'})
Current Headline: "${currentHeadline || ''}"
Current Subtitle: "${currentSubtitle || ''}"
Feature shown: "${featureContext || 'Key feature'}"
Language: ${language}

Generate 4 variations with different psychological angles:
1. "Action & Outcome" (Direct verb + concrete result)
2. "Apple Minimalist" (Clean, confident, elegant 2-4 words)
3. "Pain Point & Solution" (Relieves user frustration immediately)
4. "Social Proof & Superlative" (Trust, top-rated, industry standard)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  angle: { type: Type.STRING, description: 'The psychological angle name' },
                  badge: { type: Type.STRING },
                  headline: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  rationale: { type: Type.STRING, description: 'Why this variation works for ASO' },
                },
                required: ['angle', 'headline', 'subtitle', 'rationale'],
              },
            },
          },
          required: ['variations'],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error suggesting variations:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate copy variations',
    });
  }
});

// API: Translate & Localize Screenshot Copy
app.post('/api/ai/localize', async (req, res) => {
  try {
    const { slides, targetLanguages = ['en', 'zh-TW', 'ja'] } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Translate and culturally localize the following App Store screenshot copy for iOS App Store localization.
Ensure the translations sound native, natural, and follow high-converting App Store copywriting conventions in each target language.

Input Slides:
${JSON.stringify(slides, null, 2)}

Target Languages: ${targetLanguages.join(', ')}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            localizedSets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  languageCode: { type: Type.STRING },
                  languageName: { type: Type.STRING },
                  slides: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        slideIndex: { type: Type.INTEGER },
                        badge: { type: Type.STRING },
                        headline: { type: Type.STRING },
                        subtitle: { type: Type.STRING },
                      },
                      required: ['slideIndex', 'headline', 'subtitle'],
                    },
                  },
                },
                required: ['languageCode', 'languageName', 'slides'],
              },
            },
          },
          required: ['localizedSets'],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error localizing copy:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to localize copy',
    });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AppStore Screenshot Studio server running on http://localhost:${PORT}`);
  });
}

startServer();
