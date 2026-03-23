import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error("AI service temporarily unavailable. Please try again.");
  }
};
