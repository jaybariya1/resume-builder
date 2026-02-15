import { supabase } from "../lib/supabaseClient";


// export async function generateContent({ type, input, context }) {
//   // type: "summary" | "experience" | "project" | ...
//   // input: raw user data
//   // context: optional resume data

//   const promptMap = {
//     summary: `
//       Write a professional resume summary.
//       Tone: concise, impactful.
//       Data: ${input}
//     `,
//     experience: `
//       Write 3–5 bullet points for work experience.
//       Use action verbs and metrics.
//       Data: ${input}
//     `,
//     project: `
//       Write concise project description.
//       Focus on technologies and impact.
//       Data: ${input}
//     `,
//   };

//   const g_prompt = promptMap[type];

//   if (!g_prompt) {
//     throw new Error("Unknown generation type");
//   }

//   // call your AI API here
//   const res = await supabase.functions.invoke(
//           "open-generate-text",
//           {
//             // body: { prompt: g_prompt },
//             method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//             body: JSON.stringify({ g_prompt }),
//             // By default, invoke uses POST, but you can specify method if needed
//             // method: 'POST',
//           }
//         );
//         console.log("🔵 FULL RESPONSE:", res);
//         const result = await res.json();

//     if (error) {
//         console.error("Error invoking AI function:", error);
//         return `Error: ${error.message}`;
//       }

//   return result.generatedText;
// }

export async function generateContent({ type, input}) {
  // type: "summary" | "experience" | "project"
  // input: raw user data
  // context: optional resume data
  let systemPrompt = "You are an expert resume writer and career coach.";
  let userPrompt = "";
  const { 
    role = '', 
    experience = '', 
    skills = '' ,
    education='',
  } = input || {};

  // 2. Safety Check: If role is missing, don't even call the AI
  if (!role) {
    console.warn("AI Generation skipped: Role is missing");
    return "Please enter a Job Title/Role first.";
  }

  console.log(input.role);

  if (type === 'summary') {
    userPrompt = `Write a professional 3-sentence resume summary for a ${role}.  
    Keep it concise and punchy.`;
  } 
  else if (type === 'description') {
    userPrompt = `Write 3 professional bullet points for the role of ${role}. 
    Use strong action verbs. 
    Context: ${education}. 
    Follow the 'Accomplished [X] as measured by [Y], by doing [Z]' format.`;
  }



  if (!userPrompt) {
    throw new Error("Unknown generation type");
  }

  try {
    
    // const { data, error } = await supabase.functions.invoke(
    //   "open-generate-text",
    //   {
    //    body: { prompt: g_prompt }, // must match server expectation
    //   }
    // );

    const { data, error } = await supabase.functions.invoke('open-generate-text', {
    body: { 
      systemPrompt, 
      userPrompt 
    },
  })

    if (error) {
      console.error("Error invoking AI function:", error);
      return;
    }

 
    return data.text; // must match what your Edge Function returns
  } catch (err) {
    console.error("Unexpected error:", err);
    return `Error: ${err.message}`;
  }
}
