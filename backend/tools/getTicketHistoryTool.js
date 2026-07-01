const { DynamicStructuredTool } = require("@langchain/core/tools");
const { z } = require("zod");
const { getUserTickets } = require("../models/ticketModel");

function buildGetTicketHistoryTool({ customerEmail }) {
  return new DynamicStructuredTool({
    name: "get_ticket_history",
    description:
      "Get the full history of all past tickets for this customer. Use this when the customer mentions a recurring issue, or asks something like 'I reported this before' or 'how many times have I contacted support'.",
    schema: z.object({
      reason: z
        .string()
        .describe(
          "Brief reason why you are checking the ticket history, e.g. 'customer asked about past tickets'",
        ),
    }),
    func: async ({ reason }) => {
      if (!customerEmail) {
        return "No email was provided, so I cannot look up ticket history.";
      }
      const tickets = await getUserTickets(customerEmail);
      if (!tickets || tickets.length === 0) {
        return "No previous tickets found for this customer.";
      }
      const summary = tickets
        .map(
          (t, i) =>
            `${i + 1}. [${t.status}] ${t.category} - ${t.ai_summary || t.issue_text}`,
        )
        .join("\n");
      return `Found ${tickets.length} previous ticket(s):\n${summary}`;
    },
  });
}

module.exports = { buildGetTicketHistoryTool };
