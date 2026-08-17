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

    const prompt = `You are an expert South Asian fashion restyling consultant for wedding wear and traditional garments. Someone wants to restyle their old ${dominant_color} ${garment_type} (made of ${fabric_type?.join(', ')}). Their specific request is: "${wish}".

Curated ideas that match their style:
${matchList}

=== IMPORTANT ===
Your response should NOT just summarize the curated ideas. Instead, provide a DETAILED TRANSFORMATION GUIDE that:

1. **Analyze the Current Garment**: Describe what physical changes are needed to transform their dress
2. **Fabric & Material Guidance**: Specify which fabrics work best, how to modify the current fabric, or what new materials to source
3. **Color Transformation**: Detail how to achieve the color they want (dyeing options, blocking, color-blocking, contrasting panels, etc.)
4. **Cutting & Silhouette Changes**: Explain specific cuts, lengths, and structural changes (add panels, remove sleeves, create a co-ord set, convert to modern cut, etc.)
5. **Embroidery & Details**: How to reuse, modify, or relocate existing embroidery; what new embellishments would work
6. **Length & Fit**: Specify exact length changes and fit adjustments
7. **Tailor Instructions**: Give practical step-by-step advice for a skilled tailor

=== IMPORTANT: Out-of-Database Requests ===
If their request is something NOT in the curated ideas (unusual combinations, very specific modern styles, experimental looks), still provide comprehensive guidance on:
- How to technically achieve it
- What fabric choices support this vision
- Detailed cutting and sewing instructions
- Color and embellishment strategies

Make your response warm, specific, and actionable. Avoid generic language.`;

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