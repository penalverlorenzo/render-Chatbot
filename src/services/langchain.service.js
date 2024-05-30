import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";


const model = new ChatOpenAI(model="gpt-3.5-turbo");

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

