require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIDecision(userMessage, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

 const prompt = `
You are a customer support AI for a business. A customer has sent a message. You also have some context retrieved from the company's knowledge base, if any was found.

Customer message: "${userMessage}"
Knowledge base context: "${context || "No relevant information found."}"

RULES FOR DECIDING:
1. If the message is just casual conversation, a greeting, small talk, or not actually a support issue (e.g. "hi", "how are you", "what are you doing"), respond with "answer" and reply naturally and briefly — do NOT create a ticket for these.
2. If the knowledge base context directly and clearly answers the customer's question, use "answer" — do not create a ticket for things you can already answer confidently.
3. If the message describes a genuine problem or question but there is no relevant context, use "create_ticket".
4. Always use "create_ticket" for: account security issues, billing disputes, refund disagreements, complaints about a person/agent, or anything involving personal/sensitive data — even if you think you know the answer.
5. Do NOT create a ticket just because the question sounds complex in wording — judge based on whether it's an actual support issue.
6. If genuinely unsure whether something is a real support issue needing human review, prefer "create_ticket" over guessing — but casual chat is never a ticket.

Respond with ONLY raw JSON (no markdown, no code fences, no extra text):

- If you can answer (including casual replies):
{"action": "answer", "reply": "your helpful or friendly answer here"}

- If a ticket is needed:
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
