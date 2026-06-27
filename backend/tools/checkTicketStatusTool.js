// DynamicStructuredTool hata kar sirf 'tool' use karo jo LangChain v0.3 me standard hai
const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const { getLatestTicketByEmail } = require("../models/ticketModel");

function buildCheckTicketStatusTool({ customerEmail }) {
  return tool(
    async () => {
      if (!customerEmail) {
        return "No email was provided, so I cannot look up ticket status.";
      }
      
      try {
        const ticket = await getLatestTicketByEmail(customerEmail);
        if (!ticket) {
          return "No tickets found for this customer.";
        }
        return `Most recent ticket: status is "${ticket.status}", priority "${ticket.priority}", category "${ticket.category}". ${
          ticket.admin_reply ? `Admin reply: ${ticket.admin_reply}` : "No admin reply yet."
        }`;
      } catch (error) {
        console.error("Database fetch error in tool:", error);
        return "An error occurred while fetching the ticket status from the database.";
      }
    },
    {
      name: "check_ticket_status",
      description: "Check the status of the customer's most recent support ticket. Use this when the customer asks about an existing ticket, like 'has my issue been resolved' or 'what happened to my last ticket'.",
      // Strict empty schema taaki model apne man se koi variable na generate kare
      schema: z.object({}), 
    }
  );
}

module.exports = { buildCheckTicketStatusTool };