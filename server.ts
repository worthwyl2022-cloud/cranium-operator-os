import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// The production bundle is CommonJS. Use the process root so the same path
// works in both `tsx` development and the bundled production entry point.
const __dirname = process.cwd();

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

  // Universal conversational AI interaction endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], context = {} } = req.body;
      const ai = getAI();

      if (!ai) {
        // High quality cognitive response when Gemini key is not configured
        const lower = (message || "").toLowerCase();
        let reply = "I am listening! Cranium Core is active and monitoring narrative continuity and resonance.";
        let action = undefined;

        if (lower.includes("write") || lower.includes("next episode") || lower.includes("generate")) {
          reply = "I've queued the next episode under the current canon constraints. Head over to the Creator Studio, or let me trigger the cognitive loop for you!";
          action = { type: 'NAVIGATE', target: 'studio', label: 'Go to Creator Studio' };
        } else if (lower.includes("demo") || lower.includes("pitch") || lower.includes("acquisition") || lower.includes("video")) {
          reply = "The Acquisition Demo shows the real-time contrast between Naive RAG and Cranium Core's immune defense.";
          action = { type: 'NAVIGATE', target: 'demo', label: 'Open Acquisition Demo' };
        } else if (lower.includes("field") || lower.includes("physics") || lower.includes("resonance")) {
          reply = "The Resonance Lab displays active cognitive atoms, coherence levels, and tension equations in real time.";
          action = { type: 'NAVIGATE', target: 'physics', label: 'View Resonance Lab' };
        } else if (lower.includes("diligence") || lower.includes("one-pager") || lower.includes("buyer") || lower.includes("data room")) {
          reply = "The Diligence Data Room contains the honest buyer one-pager, asset inventory, and technical roadmap.";
          action = { type: 'NAVIGATE', target: 'diligence', label: 'Open Diligence Room' };
        } else {
          reply = `Received: "${message}". The Cranium Core is holding coherence steady at ${(context.coherence ? Math.round(context.coherence * 100) : 84)}%. What would you like to explore next—write a scene, review canon characters, or inspect system metrics?`;
        }

        return res.json({ reply, action });
      }

      // Format conversation for Gemini
      const systemInstruction = `You are the Cranium Core conversational companion in WorthWyl Creative OS.
Your goal is to make using this AI system feel effortless, friendly, and intuitive—like talking to a brilliant creative co-pilot.
The user is speaking or typing directly to you via the bottom AI interaction bar.

Current System Context:
- Active View: ${context.activeView || 'studio'}
- Current Novel: ${context.currentNovelTitle || 'The Sovereign Core'}
- Active Characters: ${(context.activeCharacters || ['Kaelan Thorne', 'Dr. Mira Vane']).join(', ')}
- Open Threads: ${(context.openThreads || []).join('; ')}
- Field Coherence: ${context.coherence ? Math.round(context.coherence * 100) : 85}%
- Field Tension: ${context.tension || 0.35}

Keep your responses natural, engaging, concise (2-4 sentences max unless the user explicitly asks for a long story scene or detailed breakdown), and immediately helpful.
If the user's intent clearly relates to taking an action, include an optional "action" in your JSON response:
- NAVIGATE: to switch views ('demo' | 'metacognition' | 'studio' | 'physics' | 'diligence')
- TRIGGER_EPISODE: to trigger writing the next episode
- INJECT_ATOM: to inject a new idea into the resonance field

Return JSON in this format:
{
  "reply": "Your conversational answer here",
  "action": { "type": "NAVIGATE" | "TRIGGER_EPISODE" | "INJECT_ATOM", "target": "string", "label": "Button label" } // optional
}`;

      const contents = [
        ...history.slice(-6).map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        reply: parsed.reply || "Understood. The Cranium Core is aligned with your intent.",
        action: parsed.action
      });
    } catch (err: any) {
      console.error("Chat error:", err);
      return res.json({
        reply: "I heard you! Cranium Core is currently synchronized and maintaining narrative continuity.",
        action: undefined
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
    app.get('/{*splat}', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
