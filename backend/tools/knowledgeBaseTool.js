const { DynamicStructuredTool } = require("@langchain/core/tools");
const { z } = require("zod");
const { searchKnowledgeBase } = require("../models/knowledgeBaseModel");

const knowledgeBaseTool = new DynamicStructuredTool({
  name: "search_knowledge_base",
  description: `Search the company's FAQ knowledge base for an answer to a customer's question. Use this first for general 
    questions about refunds, order tracking, passwords, delivery, or cancellations."`,
  schema: z.object({
    query: z
      .string()
      .describe("The customer's question or issue to search for"),
  }),
  func: async ({ query }) => {
    const result = searchKnowledgeBase(query);
    return result || "No relevant information found in the knowledge base.";
  },
});

module.exports = { knowledgeBaseTool };
