const { getAllTickets, updateTicketStatus, getUserTickets, replyToTicket } = require("../models/ticketModel");
const { runAgent } = require("../services/agentService.js")

async function handleChat(req, res) {
  const { message, customerName, customerEmail } = req.body;
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }
  try {
    const result = await runAgent({ input: message, customerName, customerEmail });
    return res.json(result);
  } catch (err) {
    console.error("Agent error:", err.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
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

async function UserTickets(req, res) {
  try {
    const { customerEmail } = req.body;
    const tickets = await getUserTickets(customerEmail);
    res.json(tickets);
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function resolveTicket(req, res) {
  const { id } = req.params;
  try {
    const updated = await updateTicketStatus(id, "resolved");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function sendReply(req, res) {
  const { id } = req.params;
  const { replyText } = req.body;
  if (!replyText) {
    return res.status(400).json({ error: "replyText is required" });
  }
  try {
    const ticket = await replyToTicket(id, replyText);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleChat,
  getTickets,
  resolveTicket,
  sendReply,
  UserTickets,
};