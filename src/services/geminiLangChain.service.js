import { HumanMessage,AIMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Storage } from '@google-cloud/storage';
import { RunnableWithMessageHistory, RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { ChatVertexAI } from "@langchain/google-vertexai";

const model = new ChatVertexAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  authOptions: {
    credentials: {
      type: "service_account",
      project_id: "testlangchain-425018",
      private_key_id: "b8fdc6823fb7e7262c5101da40461ea53d18a0b0",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDCBFTVWPX2Lb0H\n3ZecGcfpwdLH2L54T7lUB+zYdCKOid0TOYu1tdIIh19HuXxQb8EVHWe5kRfRrctd\nve8QktO2dfcJCQHnEoLLBxsRDIPvLaWQLaUxsjmslk7HrNtaEHv0QVJ9cgu4aci9\neUCCQOn+Xa1pDHgQZQkzKOHBz4YkPwGYBmFCHX37xJsb6vLxg/LFGWZSzEAYNGYO\nFmvbsEQUZ8myzzN+rStM28DY4TwiBj3wNVmpttxMF4uJS2S31DQKTPBaaxs8gHn8\nmIwr7H7FRFEVKxuDIxzYAREVsmB56W2nHbqc3N4xhSoa2EDbHwMs47+x4MAo+SmO\n4HK8xS83AgMBAAECggEATihyiFPDGf4I9X82ESNtnmR/ZhSRfmQXc5uRtQzr0uIE\n1jbLalMpnlfycTFuu/SZIslqvJ2Pq99IWqYmBVYwxYM2FkSzqIOTfviI1dBl4ddQ\nqAlLT/7NLxKJ//RJlTmoxZf/BBwKTqsGvBV5gD9oRBk2v2fPgkNBdoOUln/kOPsY\ndlq3cI0wKoEwNbsZQwiYkIGrPZtXpssIQHoOKKRC2KlZihfB/5ROUOP2GK6WkBIA\nSDm+X4XO+PhVzrAZSoUdAZ/wadlVmchTPaX9mY87whcUz2J/Hq1aPNyTn1jL3NbR\neLk58G/v4y46LVAlu7FklvCKAGIRDG7WNAK31QlWqQKBgQD0VHrLx268rzLnA7n2\nvvCT2OSfcbqvHv5jSPBfa06/cceOiVmW3prU7CS0gyXsUsvqcWrAupcMRZYUHRfs\nGaQQjyDJFvuQCvQudE5piZJtGiYnGPn35BR1fAjY3mlIEZcV+Njgx4f1S+zh3Pft\n6vjHK3IHEsTPNy6UI6L5RhSKSwKBgQDLSKdT7/J/jyIFUt9IGe2j7rIoCVU8g8dL\naYDIge1+V8kepk9bmzXvRZw/NOvjrSENqvgHpbWjwzfQMeB841wUGF1YB5m1uz2R\nb3lHG4My7LULSnW/Vl3vGjMI1FPgPRZsl09xYAX8Z8BQ5UGAvJdfIhnj0hVh0Vt5\nTNyHhDIbRQKBgQDuSHGVyYMi+06OZGD51o+z8QROx9DEN1rrI1hiBro/FU0Eosk/\nzQt9emv1rC3RA5Khq0jse00Sh87tAM6y0PLjv2K/Gu3uNfCcWYube7LVOnpZCQ/I\nBaU6SuQp9QcCZT1PDWkeFxpuTUTRpfoaC13iiGllopVUbcG8ceDgcMtZbwKBgQCw\no6IaUq7B3qruO1OfgEA5qWkPVwTEv7FGOxfXouauWTN+uX7Nl/HmxvL9DUxIGyFU\nkhJR+tD5yuFNvHlXq+xP3dgGbRxIiLn4DQgyHJsFfh/W/s2QBEk9QePEsVNsz0gT\n9ernFkw9Rh4bbQpdBgL2fFhI2T0RMW0t2vbpnpo3jQKBgBAOobh3uVT7NYKYxjsq\npnjbdVGf7UpdKSEIvhacT3oJ9t+MCkLb4GTEbFq/Q47EAyHuxHjJ6ge8vGzGra/X\npTq5JVEiWubZtTnRT5wy5NBbtgb4kSRN8a+TeFDRAHFeXAnmjLeBxQMKyenr9ZuX\nYuAp5egf6aSUHCXfqt7JOa/P\n-----END PRIVATE KEY-----\n",
      client_email: "ffigueroa@testlangchain-425018.iam.gserviceaccount.com",
      client_id: "101067674463993908638",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/ffigueroa%40testlangchain-425018.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"
    }
  }
},
);

export class VertexLangChainService {
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
      const message = [new HumanMessage({ content: userMessage, name: userMessage + '2' })]

      // const prompt = ChatPromptTemplate.fromMessages([
      //   ["system", prompt0 + " " + prompt1],
      //   ["human", "{input}"],
      //   ["ai", "Hola soy kike un asistente IA dedicado a responder preguntas sobre Nogadev"],
      //   ["placeholder", "{chat_history}"],
      // ]);
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", prompt0+ "  " + prompt1 ],
        ["human", "{input}"], // Respuesta del modelo
        ["ai", 'Hola'],
        ["placeholder", "{chat_history}"],
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
            console.log({messageHistory});
            return this.messageHistories[sessionId]
          }else{
            if (this.messageHistories[tokenSessionId].messages[0].content === this.messageHistories[tokenSessionId].messages[1].content) {
              this.messageHistories[tokenSessionId].messages.splice(1, 1);
            }
            console.log({history_else: this.messageHistories[tokenSessionId].messages});
            return this.messageHistories[sessionId];
          }
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
      throw new Error(error);
    }

  }
}

