import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini API client on server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint for Supabase public config from server secrets
  app.get('/api/config', (req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
    });
  });

  // API endpoint for AI Task Breakdown
  app.post('/api/ai/breakdown', async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API key not configured on server' });
      }

      const prompt = `Analyze this task and break it down into actionable subtasks with estimated hours and a recommended priority.
Task Title: "${title}"
Task Description: "${description || 'No description provided'}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert agile project manager and technical lead. Provide practical, detailed subtasks, accurate time estimates, and clear priority recommendations.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: 'Brief AI summary and recommendation' },
              estimatedTotalHours: { type: Type.NUMBER, description: 'Total estimated hours' },
              suggestedPriority: { type: Type.STRING, description: 'Low, Medium, High, or Urgent' },
              subtasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Actionable subtask title' },
                    hours: { type: Type.NUMBER, description: 'Estimated hours for this subtask' },
                  },
                },
              },
            },
          },
        },
      });

      const text = response.text || '{}';
      const result = JSON.parse(text);
      res.json(result);
    } catch (error: any) {
      console.error('AI breakdown error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI task breakdown' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite middleware for frontend development
    const { createServer: createViteServer } = await (eval('import("vite")') as Promise<any>);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
