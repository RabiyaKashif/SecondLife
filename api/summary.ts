import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// This logic manually searches for the .env file
const envPath = path.resolve(process.cwd(), '.env');
const envPathAlt = path.resolve(process.cwd(), 'frontend', '.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(envPathAlt)) {
  dotenv.config({ path: envPathAlt });
} else {
  console.error("FATAL: Could not find .env file at", envPath, "or", envPathAlt);
}

interface MatchedIdea {
  restyle_output: string;
  restyle_description: string;
  difficulty_level: string;
}

export default async function handler(req: any, res: any) {
  // HARDCODE YOUR OPENROUTER KEY HERE (Just like you did for Airtable)
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_KEY) {
    return res.status(500).json({ error: "OpenRouter Key is missing." });
  }

  

  try {
    const {
      garment_type,
      dominant_color,
      fabric_type,
      wish,
      topMatches,
    }: {
      garment_type: string;
      dominant_color: string;
      fabric_type: string[];
      wish: string;
      topMatches: MatchedIdea[];
    } = req.body;

    if (!topMatches || topMatches.length === 0) {
      return res.status(400).json({ error: 'No matched ideas were provided.' });
    }

    const matchList = topMatches
      .slice(0, 3)
      .map(
        (idea, i) =>
          `${i + 1}. ${idea.restyle_output} (${idea.difficulty_level}): ${idea.restyle_description}`
      )
      .join('\n');

    const prompt = `You are a thoughtful, knowledgeable restyling assistant for South Asian wedding wear. Someone has an old ${dominant_color} ${garment_type} made of ${fabric_type?.join(
      ', '
    )}. They want to restyle it and said: "${wish}".

Here are the closest curated restyle ideas:
${matchList}

Write a thorough response:
1. Explain WHY the top match fits their wish.
2. Walk through what changes and what stays the same (fabric, color, embroidery).
3. If a second match is an alternative, explain when to choose it.
4. Mention practical advice for their tailor.

Keep the tone warm and clear.`;

    // 4. Correct Fetch Implementation
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
        'X-Title': 'SecondLife App'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter Error Details:", errText);
      throw new Error(`OpenRouter failed: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content ?? null;

    if (!summary) {
      throw new Error('OpenRouter returned no content.');
    }

    return res.status(200).json({ summary });

  } catch (error: any) {
    console.error("DETAILED ERROR:", error.message);
    
    // This is the secret to stopping the Windows crash:
    // It sends the error to the browser so Node.js doesn't panic
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Backend Error", 
        message: error.message 
      });
    }
    return; // Force the function to stop here
  }
}