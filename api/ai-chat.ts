interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RestyleIdea {
  restyle_output: string;
  restyle_description: string;
  difficulty_level: string;
  garment_type: string;
  fabric_type: string[];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_KEY) {
    console.error('CRITICAL: OPENROUTER_API_KEY not set in environment');
    return res.status(500).json({ 
      error: 'Configuration error',
      message: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to Vercel environment variables.'
    });
  }

  try {
    const {
      garment_type,
      dominant_color,
      fabric_type,
      original_wish,
      user_question,
      topMatches,
      conversationHistory
    }: {
      garment_type: string;
      dominant_color: string;
      fabric_type: string[];
      original_wish: string;
      user_question: string;
      topMatches: RestyleIdea[];
      conversationHistory: Message[];
    } = req.body;

    if (!user_question) {
      return res.status(400).json({ error: 'User question is required' });
    }

    const matchList = topMatches
      .slice(0, 3)
      .map((idea: RestyleIdea) => `• ${idea.restyle_output} (${idea.difficulty_level}): ${idea.restyle_description}`)
      .join('\n');

    // Build conversation history for context
    const conversationContext = conversationHistory
      .slice(-6) // Keep last 6 messages for context
      .map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      }));

    // Add the system context at the beginning
    const messages: Message[] = [
      {
        role: 'user',
        content: `You are an expert South Asian fashion restyling consultant. The user has a ${dominant_color} ${garment_type} made of ${fabric_type.join(', ')}.

Their original request was: "${original_wish}"

Here are curated ideas that match their style:
${matchList}

You are having a conversation with them about transforming their garment. Provide DETAILED, PRACTICAL advice about:
- Fabric modifications and recommendations
- Color transformation techniques
- Specific cutting and sewing instructions
- Embroidery handling
- Length and silhouette changes
- Step-by-step tailor instructions

Be specific and actionable. If they ask about something outside the database, still provide comprehensive guidance.`
      },
      ...conversationContext
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://second-life-steel.vercel.app',
        'X-Title': 'SecondLife Styling'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          ...messages,
          { role: 'user', content: user_question }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter Error:', error);
      throw new Error(`OpenRouter API failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter');
    }
    
    const aiResponse = data.choices[0].message.content;

    return res.status(200).json({ response: aiResponse });
  } catch (error: any) {
    console.error('Chat handler error:', error.message);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
}
