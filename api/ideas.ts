import dotenv from 'dotenv';
import path from 'path';

// 1. Force load the keys even if Vercel "ignores" the file
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

export default async function handler(req: any, res: any) {
  // 2. Define the variables
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const TABLE_ID = 'tblcFnweUc3TizuGs'; 
  
  // Debug: This will show in your terminal
  console.log("--- BACKEND CHECK ---");
  console.log("Checking Base ID:", !!BASE_ID);
  console.log("Checking Token:", !!TOKEN);

  if (!BASE_ID || !TOKEN) {
    return res.status(500).json({ error: "Missing keys in .env.local" });
  }

  // 3. Build the URL using TABLE_NAME
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json(err);
    }

    const data = await response.json();
    return res.status(200).json(data);

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