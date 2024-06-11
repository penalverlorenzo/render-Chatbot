import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory, RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";


const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

export class OpenAILangChainService {
    constructor() {
        this.messageHistories = {
        }
    }
    async generateMessage(userMessage, tokenSessionId, context) {
        try {
            const data = context.dataString.replaceAll('"', '').replaceAll('{', ' ').replaceAll('}', ' ')
            const prompt1 = `
                Responde el mensaje usando esta información: ${data}.
                Tarea: Toma el mensaje, y respondelo usando la información e idioma anteriormente mencionados.
                En caso de que el mensaje no esté realcionado a la información, dejales saber que no estas diseñado para responder a eso.
                Si te piden una broma/chiste, cuenta una corta relacionada a la programación que esté en el idioma indicado.`;
            const prompt0 = "Eres Kike, un asistente IA dedicado a responder preguntas sobre Nogadev"

            const message = [new HumanMessage({ content: userMessage })]

            const prompt = ChatPromptTemplate.fromMessages([
                ["system", prompt0],
                ["system", prompt1,],
                ["placeholder", "{chat_history}"],
                ["human", "{input}"],
            ]);

            const filterMessages = ({ chat_history }) => {
                return chat_history.slice(-10);
            };
            const chain = RunnableSequence.from([
                RunnablePassthrough.assign({
                    chat_history: filterMessages,
                }),
                prompt,
                model,
            ]);


            const withMessageHistory = new RunnableWithMessageHistory({
                runnable: chain,
                getMessageHistory: async (sessionId) => {
                    if (this.messageHistories[sessionId] === undefined) {
                        const messageHistory = new InMemoryChatMessageHistory();
                        await messageHistory.addMessages(message);
                        this.messageHistories[sessionId] = messageHistory;
                    }
                    return this.messageHistories[sessionId];
                },
                inputMessagesKey: "input",
                historyMessagesKey: "chat_history",
            });

            const config = {
                configurable: {
                    sessionId: tokenSessionId,
                },
            };
            const response = await withMessageHistory.invoke(
                {
                    input: userMessage,
                },
                config
            );
            const res = response.content
            return res;
        } catch (error) {
            console.log({ error });
            throw new Error(error)
        }

    }
}

