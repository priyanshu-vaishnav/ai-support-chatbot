const { z } = require('zod');

const AIResponseSchema = z.union([
  z.object({
    action: z.literal("answer"),
    reply: z.string()
  }),
  z.object({
    action: z.literal("create_ticket"),
    category: z.enum(["billing", "technical", "general"]),
    priority: z.enum(["low", "medium", "high"]),
    summary: z.string()
  })
]);

module.exports = { AIResponseSchema };