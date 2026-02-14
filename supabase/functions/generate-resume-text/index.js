import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// Log to confirm the function is starting
console.log("Edge function 'generate-resume-text' is running.");

serve(async (req) => {
  // This is needed for browser-based calls to your function.
  // It handles the "preflight" request that browsers send.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*', // Be more specific in production
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    // 1. Get the Gemini API key from Supabase secrets
    const API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in Supabase secrets.");
    }

    // 2. Extract the user's prompt from the request body
    const { prompt } = await req.json();
    if (!prompt) {
      throw new Error("No prompt was provided in the request body.");
    }

    // 3. Initialize the Google AI client and model
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 4. Call the Gemini API to generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send the generated text back to the client
    return new Response(
      JSON.stringify({ generatedText: text }),
      {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*', // Be more specific in production
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 200,
      }
    );

  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in Edge Function:", error.message);

    // Return a structured error response to the client
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*', // Be more specific in production
        },
        status: 500,
      }
    );
  }
});
