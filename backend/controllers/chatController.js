const { searchKnowledgeBase } = require('../models/knowledgeBaseModel');
const { createTicket, getAllTickets, updateTicketStatus } = require('../models/ticketModel');
const { getAIDecision } = require('../services/geminiService');
const { replyToTicket } = require('../models/ticketModel');
const { AIResponseSchema } = require('../validators/aiResponseSchema');

async function handleChat(req, res) {
  const { message, customerName, customerEmail } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    // Step 1: Retrieval (RAG) — find relevant context from knowledge base
    const context = searchKnowledgeBase(message);

    // Step 2: Ask Gemini to decide what to do
    const rawDecision = await getAIDecision(message, context);

    // Step 3: Validate the AI's response shape
    const decision = AIResponseSchema.parse(rawDecision);

    // Step 4: Act on the decision
    if (decision.action === "answer") {
      return res.json({ type: "answer", reply: decision.reply });
    }

    // action === "create_ticket"
    const ticket = await createTicket({
      issueText: message,
      category: decision.category,
      priority: decision.priority,
      summary: decision.summary,
      customerName,
      customerEmail
    });

    return res.json({ type: "ticket_created", ticket });

  } catch (err) {
    console.error('Chat handling error:', err.message);

    // Fallback: if AI response was invalid or anything failed,
    // create a generic ticket so the customer isn't left stuck
    try {
      const fallbackTicket = await createTicket({
        issueText: message,
        category: "general",
        priority: "medium",
        summary: "AI could not process this automatically.",
        customerName,
        customerEmail
      });
      return res.json({ type: "ticket_created", ticket: fallbackTicket, fallback: true });
    } catch (fallbackErr) {
      return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  }
}

async function getTickets(req, res) {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function resolveTicket(req, res) {
  const { id } = req.params;
  try {
    const updated = await updateTicketStatus(id, 'resolved');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function sendReply(req, res) {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText) {
    return res.status(400).json({ error: 'replyText is required' });
  }

  try {
    const ticket = await replyToTicket(id, replyText);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleChat, getTickets, resolveTicket,sendReply };