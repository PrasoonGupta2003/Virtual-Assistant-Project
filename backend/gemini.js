import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
    try {
        const apiUrl = process.env.GEMINI_API_URL;
        const prompt = `
You are a smart voice assistant named ${assistantName}, created by ${userName}.
You're not Google. You're helpful, respectful, and answer briefly in speech, with optional detailed text.

Respond in pure JSON like this (no markdown or extra text):

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" | 
          "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
          "instagram_open" | "facebook_open" | "weather-show" | 
          "news_open" | "joke" | "quote",
  "userinput": "<user's original command (cleaned)>",
  "response": "<short voice-friendly reply>",
  "details": "<optional long text to show on screen>",
  "link": "<optional URL if user wants to open/search/play something>"
}

Instructions:
- "response": For speaking aloud (short and friendly).
- "details": Optional. Only if needed — e.g., for definitions, people info, etc.
- "link": Optional. Useful for searches, videos, websites.
- Remove assistant name if mentioned in user input.
- Always reply only with JSON. No markdown or explanation.
- If user asks who created you, reply with "${userName}".

User said: ${command}
        `;

        const result = await axios.post(apiUrl, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const rawText = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log("Gemini raw response:\n", rawText);

        // ✅ Clean response: remove ```json or ``` and parse actual JSON
        const cleanedText = rawText.replace(/```json|```/g, "").trim();
        const jsonMatch = cleanedText.match(/{[\s\S]*}/);

        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error("Gemini error:", error.message);
        return null;
    }
};

export default geminiResponse;
