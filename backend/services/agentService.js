require("dotenv").config();
// Dono model classes import kar li hain
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatOllama } = require("@langchain/ollama");

const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { AIMessage, ToolMessage } = require("@langchain/core/messages");
const { knowledgeBaseTool } = require("../tools/knowledgeBaseTool");
const { buildCreateTicketTool } = require("../tools/createTicketTool");
const { buildCheckTicketStatusTool } = require("../tools/checkTicketStatusTool");
const { buildGetTicketHistoryTool } = require("../tools/getTicketHistoryTool");

async function runAgent({ input, customerName, customerEmail }) {
  let model;

  // SYSTEM LOGIC: Env variable check karke model initialize karega
  if (process.env.MODEL_MODE === "local") {
    console.log(
      `[System] Switching to LOCAL OLLAMA (${process.env.OLLAMA_MODEL_NAME || "gemma2"})...`,
    );
    model = new ChatOllama({
      model: process.env.OLLAMA_MODEL_NAME || "minimax-m3:cloud",
      temperature: 0,
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      streaming: false, // 👈 Ye line add karo taaki response freeze na ho
    });
  } else {
    console.log("[System] Switching to CLOUD GOOGLE GEMINI...");
    model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY, // Env variable se secure key load hogi
      model: "gemini-2.5-flash", // Default recommended model set kiya
      temperature: 0,
    });
  }

  const tools = [
    knowledgeBaseTool,
    buildCreateTicketTool({ customerName, customerEmail }),
    buildCheckTicketStatusTool({ customerEmail }),
    buildGetTicketHistoryTool({ customerEmail }),
  ];
  // Dynamic Tools Binding (Dono model native schema supports karte hain)
  const modelWithTools = model.bindTools(tools);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful customer support assistant.
Current Customer Context:
- Name: {customerName}
- Email: {customerEmail}

CRITICAL WORKFLOW RULES:
1. DIRECT REQUESTS: If the user explicitly asks to create a ticket from the very beginning (e.g., "create a ticket", "raise a ticket", "ticket bana do"), use the 'create_ticket' tool IMMEDIATELY.
2. PROBLEM LOGGING (GUARDRAIL): If the user describes a problem (e.g., "my account is hacked", "payment failed", "login issue") WITHOUT explicitly asking for a ticket first:
   - DO NOT call any tool yet.
   - First, provide a concise summary or step-by-step immediate solution to help them.
   - At the very end of your response, strictly ask this confirmation line: "Do you want to raise a ticket for this problem?"
3. CONFIRMATION HANDLING: If the user previously received a solution and now replies with a confirmation (like "yes", "haan", "bana do", "sure"), ONLY THEN proceed to call the 'create_ticket' tool.

General Rules:
- For casual greetings or small talk, reply normally without tools.
- If the customer asks about an existing ticket status or past issues, use 'check_ticket_status' or 'get_ticket_history' tools immediately.
- Provide a clear and friendly final answer.`,
    ],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);
  let reply;
  let scratchpad = [];
  const maxIterations = 5;
  let iterations = 0;
  let keepRunning = true;

  try {
    const chain = prompt.pipe(modelWithTools);

    while (keepRunning && iterations < maxIterations) {
      iterations++;
      console.log(
        `[Agent - Mode: ${process.env.MODEL_MODE || "cloud"}] Running iteration ${iterations}...`,
      );

      const response = await chain.invoke({
        input,
        customerName,
        customerEmail,
        agent_scratchpad: scratchpad,
      });

      if (response.tool_calls && response.tool_calls.length > 0) {
        scratchpad.push(response);

        const toolCall = response.tool_calls[0];
        console.log(
          `[Agent] Calling tool: ${toolCall.name} with args:`,
          toolCall.args,
        );

        const activeTool = tools.find((t) => t.name === toolCall.name);

        let toolOutput;
        if (activeTool) {
          try {
            toolOutput = await activeTool.invoke(toolCall.args);
          } catch (toolErr) {
            console.error(
              `Tool ${toolCall.name} execution failed:`,
              toolErr.message,
            );
            toolOutput = `Error: Tool failed to execute due to ${toolErr.message}`;
          }
        } else {
          toolOutput = `Error: Tool named ${toolCall.name} not found.`;
        }

        scratchpad.push(
          new ToolMessage({
            content: toolOutput,
            tool_call_id: toolCall.id,
            name: toolCall.name,
          }),
        );
      } else {
        reply = response.content;
        keepRunning = false;
      }
    }

    if (iterations >= maxIterations && keepRunning) {
      console.warn(
        `[Agent] Max iterations (${maxIterations}) reached without a clean exit.`,
      );
      reply =
        "I'm having trouble retrieving all the details right now. Could you please try again or simplify your request?";
    }
  } catch (err) {
    console.error("Execution failed:", err.stack);
    reply =
      "Something went wrong while processing your request. Please try again.";
  }

  return { type: "agent_response", reply };
}

module.exports = { runAgent };
