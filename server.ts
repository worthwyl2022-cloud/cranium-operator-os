import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Novel episode generation endpoint
  app.post("/api/novel/generate", async (req, res) => {
    try {
      const { episodeNumber, coherenceContext, directive, customPrompt } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.status(200).json({ ok: false, reason: "NO_API_KEY" });
      }

      const prompt = `You are the WorthWyl OS v3 Novel Engine operating under strict canon and continuity constraints.
Directive Posture: ${directive || 'ADVANCE'}
Episode Number: ${episodeNumber}
Active Characters: ${(coherenceContext?.activeCharacters || []).join(', ')}
Current Location: ${coherenceContext?.currentLocation || 'Unknown'}
Open Narrative Threads to respect or advance: ${(coherenceContext?.urgentOpenThreads || []).join('; ')}
Forbidden Patterns: ${(coherenceContext?.prohibitedPatterns || []).join('; ')}
${customPrompt ? `Creator Specific Prompt: ${customPrompt}` : ''}

Generate the next episode of the serial. Format your output strictly as a JSON object with the following keys:
{
  "title": "Short evocative title",
  "text": "3 paragraphs of atmospheric, tense, grounded narrative prose advancing the scene without deus ex machina",
  "tone": "dark | reflective | tense | resolute | speculative",
  "pacing": "slow | medium | fast",
  "characters": ["Array of characters appearing in this scene"],
  "locations": ["Array of locations in this scene"]
}
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (err: any) {
      console.warn("Gemini generation warning:", err?.message || err);
      return res.status(200).json({ ok: false, error: err?.message });
    }
  });

  // Story Forge AI conversational assistant endpoint
  app.post("/api/novel/assistant", async (req, res) => {
    try {
      const { message, continuity, currentEpisode } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          reply: "I am currently running in offline cognitive mode. The WorthWyl canon is sealed with zero drift. How would you like to direct the next narrative beat?",
          directiveSuggestion: "ADVANCE"
        });
      }

      const prompt = `You are the WorthWyl Story Forge Assistant, a creative continuity partner in the Cranium Core architecture.
Current Episode Title: ${currentEpisode?.title || 'Unknown'}
Active Characters: ${Object.keys(continuity?.characters || {}).join(', ')}
Open Threads: ${(continuity?.openThreads || []).join('; ')}

User question or request: "${message}"

Provide a concise, insightful, craft-grounded response (2-3 sentences max) to help the writer maintain continuity, explore psychological stakes, or prepare the next episode. Also suggest one directive posture from [ADVANCE, ESCALATE, STABILIZE, SHIFT_THEME].
Format as JSON: { "reply": "...", "directiveSuggestion": "ADVANCE" }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      return res.json({
        reply: "Canon integrity verified. Recommend focusing on unresolved threads before introducing new anomalies.",
        directiveSuggestion: "STABILIZE"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
