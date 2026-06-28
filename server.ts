import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 15MB limit for handling base64 image uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize Google Gemini SDK (Server-Side)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint: Civic Image Analysis using Gemini 2.5 Flash Vision
app.post("/api/analyze", async (req, res): Promise<any> => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image data in request" });
    }

    // Clean base64 prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const cleanMimeType = mimeType || "image/jpeg";

    const ai = getAiClient();

    const systemPrompt = `You are a civic issue analyzer for Indian cities. 
Analyze the uploaded image carefully and return ONLY valid raw JSON with no extra text, no markdown, no backticks:
{
  category: "Pothole" | "Broken Streetlight" | "Garbage" | "Water Leak" | "Road Damage" | "Other",
  severity: "Low" | "Medium" | "High" | "Critical",
  title: "short 6-8 word issue title",
  description: "2-3 sentence clear description",
  department: "PWD" | "Municipal Corporation" | "Electricity Board" | "Water Authority" | "Sanitation Department",
  urgencyScore: number 1-10,
  estimatedFixTime: "2-3 days" | "1 week" | "2 weeks" | "1 month",
  tags: [array of 2-3 relevant tags],
  confidence: float 0.0-1.0
}`;

    const imagePart = {
      inlineData: {
        mimeType: cleanMimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: systemPrompt,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text response received from Gemini");
    }

    try {
      const parsedJson = JSON.parse(responseText.trim());
      res.json(parsedJson);
    } catch (parseError) {
      // Fallback: search for JSON block inside backticks if model ignored the custom format setting
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        const parsedJson = JSON.parse(match[0]);
        res.json(parsedJson);
      } else {
        throw new Error("Gemini returned invalid JSON structure: " + responseText);
      }
    }
  } catch (error: any) {
    console.error("Error analyzing civic image:", error);
    res.status(500).json({
      error: "Failed to analyze image with Gemini AI",
      details: error.message || error,
    });
  }
});

// REST API endpoint: Resolution Verification using Gemini Vision with Before and After images
app.post("/api/verify-resolution", async (req, res): Promise<any> => {
  try {
    const { beforeImage, beforeMimeType, afterImage, afterMimeType } = req.body;

    if (!beforeImage || !afterImage) {
      return res.status(400).json({ error: "Both before and after images are required." });
    }

    const cleanBeforeBase64 = beforeImage.replace(/^data:image\/\w+;base64,/, "");
    const cleanBeforeMimeType = beforeMimeType || "image/jpeg";

    const cleanAfterBase64 = afterImage.replace(/^data:image\/\w+;base64,/, "");
    const cleanAfterMimeType = afterMimeType || "image/jpeg";

    const ai = getAiClient();

    const promptString = `Compare these two civic issue images. 
The first image shows the reported issue before fixing, and the second image shows the same location after a reported resolution.
Determine if the described civic issue (garbage, road damage, puddle, water leak, broken streetlight) is resolved or not.
Return ONLY valid raw JSON with no extra text, no markdown, no backticks:
{ 
  "resolved": true | false, 
  "confidence": 0-100, 
  "reason": "one sentence explanation" 
}`;

    const beforePart = {
      inlineData: {
        mimeType: cleanBeforeMimeType,
        data: cleanBeforeBase64,
      },
    };

    const afterPart = {
      inlineData: {
        mimeType: cleanAfterMimeType,
        data: cleanAfterBase64,
      },
    };

    const textPart = {
      text: promptString,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [beforePart, afterPart, textPart] },
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text response received from Gemini verification call");
    }

    try {
      const parsedJson = JSON.parse(responseText.trim());
      res.json(parsedJson);
    } catch (parseError) {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        const parsedJson = JSON.parse(match[0]);
        res.json(parsedJson);
      } else {
        throw new Error("Gemini returned invalid verification JSON: " + responseText);
      }
    }
  } catch (error: any) {
    console.error("Error verifying civic resolution:", error);
    res.status(500).json({
      error: "Failed to compare and verify civic resolution using Gemini",
      details: error.message || error,
    });
  }
});

// REST API endpoint: AI Chatbot Assistant using Gemini 2.5 Flash
app.post("/api/chat", async (req, res): Promise<any> => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message in request" });
    }

    const ai = getAiClient();

    const systemPrompt = `You are Samadhan, a helpful AI assistant for the Samadhan Setu civic 
issue platform. You help Indian citizens understand:
- How to report civic issues (potholes, garbage, water leaks, broken 
  streetlights, road damage)
- Status of municipal departments (PWD, Municipal Corporation, Electricity 
  Board, Water Authority, Sanitation Department)
- How the karma and points system works (Report=+10, Upvote=+2, Verify=+15)
- General civic rights and how to escalate unresolved issues
- How to use the Samadhan Setu app features

Current platform context: ${context || ""}

Keep responses concise (2-4 sentences), friendly, and practical. 
Always respond in the same language the user writes in.
Reply only in plain text, no markdown formatting.`;

    const textPart1 = {
      text: systemPrompt,
    };

    const textPart2 = {
      text: message,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart1, textPart2] },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text response received from Gemini chatbot call");
    }

    res.json({ reply: responseText.trim() });
  } catch (error: any) {
    console.error("Error in AI Chatbot Assistant:", error);
    res.status(500).json({
      error: "Failed to generate response with Gemini AI",
      details: error.message || error,
    });
  }
});

// App health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date() });
});

// Setup Express+Vite full-stack serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Samadhan Setu server running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Critical server configuration error:", error);
});
