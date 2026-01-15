
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardStats, InsightReport } from "../types";

export const getSmartInsights = async (stats: DashboardStats): Promise<InsightReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following visitor dashboard stats for Geotheater:
    - Total Visitors: ${stats.total}
    - Male vs Female: ${stats.totalL} vs ${stats.totalP}
    - Age Groups: Children(${stats.anak}), Teens(${stats.remaja}), Adults(${stats.dewasa}), Seniors(${stats.lansia})
    - Top Origins: ${JSON.stringify(Object.entries(stats.origins).slice(0, 3))}
    
    Provide a concise analysis including a summary of trends, actionable recommendations for management, and a trending status.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            trendingStatus: {
              type: Type.STRING,
              description: "Must be 'up', 'down', or 'stable'"
            }
          },
          required: ["summary", "recommendations", "trendingStatus"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as InsightReport;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      summary: "AI Insights currently unavailable. Trends show consistent engagement from regional centers.",
      recommendations: ["Monitor weekend traffic closely", "Tailor programs for the dominant age group"],
      trendingStatus: "stable"
    };
  }
};
