import { ChatVertexAI } from "@langchain/google-vertexai";
import { HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import {Storage} from '@google-cloud/storage';

// async function authenticateImplicitWithAdc() {
//   // This snippet demonstrates how to list buckets.
//   // NOTE: Replace the client created below with the client required for your application.
//   // Note that the credentials are not specified when constructing the client.
//   // The client library finds your credentials using ADC.
//   const storage = new Storage({
//     projectId: 2,
//   });
//   const [buckets] = await storage.getBuckets();
//   console.log('Buckets:');

//   for (const bucket of buckets) {
//     console.log(`- ${bucket.name}`);
//   }

//   console.log('Listed all storage buckets.');
// }
authenticateImplicitWithAdc()
const model = new ChatVertexAI({
    model: "gemini-1.5-pro",
    temperature: 0,
    // apiKey: config.iaKey,
    // authOptions: {projectId: 2}
});

export class LangChainService {
    async generateMessage(userMessage, messageHistories) {
        const message =[ new HumanMessage({ content: userMessage })]
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are a helpful assistant who remembers all details the user shares with you.`,
            ],
            ["placeholder", "{chat_history}"],
            ["human", "{input}"],
        ]);
        const chain = prompt.pipe(model);

        const withMessageHistory = new RunnableWithMessageHistory({
            runnable: chain,
            getMessageHistory: async (sessionId) => {
                if (messageHistories[sessionId] === undefined) {
                    const messageHistory = new InMemoryChatMessageHistory();
                    await messageHistory.addMessages(message);
                    messageHistories[sessionId] = messageHistory;
                }
                return messageHistories[sessionId];
            },
            inputMessagesKey: "input",
            historyMessagesKey: "chat_history",
        });

        const config = {
            configurable: {
                sessionId: "abc4",
            },
        };

        const response = await withMessageHistory.invoke(
            {
                input: message,
            },
            config
        );
        console.log({response});

    }
}

