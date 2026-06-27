const { DynamicStructuredTool } = require("@langchain/core/tools");
const { z } = require("zod");
const { createTicket } = require("../models/ticketModel");

function buildCreateTicketTool({ customerName, customerEmail }) {
  return new DynamicStructuredTool({
    name: "create_ticket",
    description:
      "Create a support ticket when the customer's issue cannot be answered from the knowledge base, or when it involves security, billing disputes, complaints, or sensitive/personal matters that need human review.",
    schema: z.object({
      issueText: z
        .string()
        .describe("The original customer message describing the issue"),
      category: z
        .enum(["billing", "technical", "general"])
        .describe("The category of the issue"),
      priority: z
        .enum(["low", "medium", "high"])
        .describe("How urgent this issue is"),
      summary: z
        .string()
        .describe("A short summary of the issue for the admin"),
    }),
    func: async ({ issueText, category, priority, summary }) => {
      const ticket = await createTicket({
        issueText,
        category,
        priority,
        summary,
        customerName,
        customerEmail,
      });
      return `Ticket created successfully with ID ${ticket.id} and priority ${ticket.priority}.`;
    },
  });
}

module.exports = { buildCreateTicketTool };
