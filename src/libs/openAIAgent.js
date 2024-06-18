import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { DynamicTool } from '@langchain/core/tools'
import { HumanMessage } from "@langchain/core/messages";

import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

// ---- models ----
const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

export class agent {
  constructor() {
    this.messageHistories = {
    }
}

async agentCreation(message, identificador, contexto, sessionId) {
    try {
      const userMsg = [new HumanMessage({ content: message })]

      const documents = contexto.dataString.replaceAll('"', '').replaceAll('{', ' ').replaceAll('}', ' ');

      const sendMessagesToSlackTool = new DynamicTool({
        name: "MessagesToSlack",
        description:
          `Debes utilizar esta herramienta siempre que el mensaje sea 234`,

        func: () => console.log('ejecutanding'),
      })
      const tools = [sendMessagesToSlackTool];

      const prompt1 = `
                Responde el mensaje usando esta información: ${documents}.
                Tarea: Toma el mensaje, y respondelo usando la información e idioma anteriormente mencionados.
                En caso de que el mensaje no esté realcionado a la información, dejales saber que no estas diseñado para responder a eso.
                Si te piden una broma/chiste, cuenta una corta relacionada a la programación que esté en el idioma indicado.`;
      const prompt0 = "Eres Kike, un asistente IA dedicado a responder preguntas sobre Nogadev"

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", prompt0],
        ["system", prompt1,],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"],
      ]);

      const agent = await createToolCallingAgent({ llm: model, tools, prompt });

      const agentExecutor = new AgentExecutor({
        agent,
        tools,
      });

      const agentWithChatHistory = new RunnableWithMessageHistory({
        runnable: agentExecutor,
        getMessageHistory: async (sessionId) => {
          if (this.messageHistories[sessionId] === undefined) {
              const messageHistory = new InMemoryChatMessageHistory();
              await messageHistory.addMessages(userMsg);
              this.messageHistories[sessionId] = messageHistory;
          }
          return this.messageHistories[sessionId];
      },
        inputMessagesKey: "input",
        historyMessagesKey: "chat_history",
      });
      const config = {
        configurable: {
            sessionId: identificador,
        },
    };
    
      const res = await agentWithChatHistory.invoke({ input: message }, config);
      console.log({res});
      return res.output
    } catch (error) {
      console.log({error});
      throw new Error("Ocurrio un error al ejecutar tu agente ", error);
    }

  }

}
