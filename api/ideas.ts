export default async function handler(req: any, res: any) {
  // Get credentials from environment (works on both local and Vercel)
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const TABLE_ID = 'tblcFnweUc3TizuGs'; 
  
  console.log("--- BACKEND CHECK ---");
  console.log("Checking Base ID:", !!BASE_ID);
  console.log("Checking Token:", !!TOKEN);

  if (!BASE_ID || !TOKEN) {
    return res.status(500).json({ 
      error: "Missing credentials",
      message: "AIRTABLE_BASE_ID or AIRTABLE_TOKEN not set in environment"
    });
  }

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?pageSize=100`;
    const response = await fetch(url, {
      headers: { 
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Airtable Error:", error);
      return res.status(response.status).json({ 
        error: 'Airtable API error',
        status: response.status
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("DETAILED ERROR:", error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Backend Error", 
        message: error.message 
      });
    }
    return;
  }
}