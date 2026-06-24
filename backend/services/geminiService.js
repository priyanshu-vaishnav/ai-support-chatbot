require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIDecision(userMessage, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a customer support AI. A customer has sent a message. You also have some context retrieved from the company's knowledge base, if any was found.

Customer message: "${userMessage}"
Knowledge base context: "${context || "No relevant information found."}"

Decide what to do and respond with ONLY raw JSON (no markdown, no code fences, no extra text):

- If the context is sufficient to confidently answer the customer, respond with:
{"action": "answer", "reply": "your helpful answer here"}

- If the context is not relevant or the issue needs human review (e.g. security, disputes, custom requests), respond with:
{"action": "create_ticket", "category": "billing" or "technical" or "general", "priority": "low" or "medium" or "high", "summary": "short summary of the issue"}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if Gemini adds them despite instructions
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

module.exports = { getAIDecision };
