
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIInsight } from "../types";

export const getFinancialInsights = async (transactions: Transaction[]): Promise<AIInsight[]> => {
  if (transactions.length === 0) {
    return [{
      title: "Get Started",
      content: "Add some transactions to see AI-powered financial insights and saving tips!",
      severity: "info"
    }];
  }

  // Always initialize with the direct environment variable as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recentTransactions = transactions.slice(0, 20).map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    date: t.date,
    description: t.description
  }));

  const prompt = `
    Analyze these recent financial transactions and provide 3 actionable insights or observations.
    Be encouraging, concise, and smart. 
    Transactions: ${JSON.stringify(recentTransactions)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Internal model identifier remains the same for technical compatibility
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              severity: { 
                type: Type.STRING,
                description: "Must be 'info', 'warning', or 'positive'"
              }
            },
            required: ["title", "content", "severity"]
          }
        }
      }
    });

    // Access text as a property
    const result = JSON.parse(response.text || "[]");
    return result;
  } catch (error) {
    console.error("Appsgm AI Insight Error:", error);
    return [{
      title: "Oops!",
      content: "I couldn't crunch the numbers right now. Please try again later.",
      severity: "warning"
    }];
  }
};
