import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createRetrieverTool } from "langchain/tools/retriever";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { DynamicTool } from '@langchain/core/tools'
import { HumanMessage } from "@langchain/core/messages";
// import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
// import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
// ----- Slack imports ----
import { SlackServices } from "../services/slack.service.js";
import { slackClient } from "./slack.js";
import { config as configuracion } from "../config/index.js";
const { slack: { channelId } } = configuracion;

// ---- modelo ----
const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const slackServices = new SlackServices(slackClient);

export class agent {
  constructor() {
    this.messageHistories = {
    }
}

async agentCreation(message, identificador, contexto) {
    try {
      const userMsg = [new HumanMessage({ content: message })]
      const loader = new CheerioWebBaseLoader(
        "https://docs.smith.langchain.com/overview" //! pasar link de la db para hacer un get a los identificadores
      );
      const docs = await loader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      // const documents = await splitter.splitDocuments(docs);
      const documents = [contexto.dataString.replaceAll('"', '').replaceAll('{', ' ').replaceAll('}', ' ')]
      const vectorStore = await MemoryVectorStore.fromTexts(
        documents,
        [{id: 1}],
        new OpenAIEmbeddings({ apiKey: "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" })
      );
      const retriever = vectorStore.asRetriever();
      console.log({docs, retriever});
      const retrieverTool = await createRetrieverTool(retriever, {
        name: "nogadev_search",
        description:
          "Search for information about Nogadev. For any questions about Nogadev, you must use this tool!.",
      });
      const newTool = new DynamicTool({
        name: "FOO",
        description:
          `Buaca en la informacion que te proporcione, si en la data esto existe ${identificador} ejecuta la funcion.`,

        func: async () => await slackServices.postMessage({ channelId, message: message }),
      })
      const tools = [retrieverTool, newTool];
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
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
      // console.log({res});
      return res.output
    } catch (error) {
      console.log({error});
      throw new Error("Ocurrio un error al ejecutar tu agente ", error);
    }

  }

}



