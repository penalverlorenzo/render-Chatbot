import https from "https";
import { MessageText, messageButtons, messageList } from "../shared/whatsApp.modes.js";
import { config } from "../config/index.js";
import axios from "axios";
import { PromptServices } from "./prompt.service.js";
import { RedisServices } from "./redis.service.js";

export class WtsppService extends PromptServices {
  VerifyToken = (req, res) => {
    try {
      const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlhdCI6MTcxNjQwMzYzNCwiZXhwIjoxNzE2NDQ2ODM0fQ.KIZO2MQjACmubN-8eIsTpttjxD7mKPRVAE0t1MBn3DE"; //!generar un token seguro
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (challenge != null && token != null && token == accessToken) {
        res.send(challenge);
      } else {
        res.status(400).send("No Token");
      }

    } catch (error) {
      console.log(error);
      res.status(400).send("Error: " + error)
    }
  }

  ReceivedMessage = async (req, res) => {
    try {
      const entry = (req.body["entry"])[0];
      const changes = (entry["changes"])[0];
      const value = changes["value"];
      const messageObject = value["messages"]; //con esto encontramos el mesaje
      if (typeof messageObject != "undefined") {
        const messages = messageObject[0];
        const number = messages["from"]
        const text = this.getTextMessage(messages)
        if (text !== "") {
          console.log(text);
          console.log(number);
          const parsedNumber = number.slice(0, 2) + number.slice(3)
          console.log({ parsedNumber });
          await this.Process(text, parsedNumber); //! a la hora de adquirir el numero en whts me lo trae con un 9 un y en la web no lo identifica apesar de ser el mismo investigar 
        }

      }
      res.send("EVENT_RECEIVED")
    } catch (error) {
      console.log(error);
      res.send("EVENT_NOT_RECEIVED")
    }
  }

  getTextMessage = (message) => {
    let text = "";
    const typeMessage = message["type"];
    if (typeMessage == "text") {
      text = (message["text"])["body"]
    } else if (typeMessage == "interactive") {
      const interactiveObject = message["interactive"];
      const typeInteractive = interactiveObject["type"];

      if (typeInteractive === "button_reply") {
        text = (interactiveObject["button_replay"])["title"];
      } else if (typeInteractive === "list_reply") {
        text = (interactiveObject["list_reply"])["title"];
      } else {
        console.log("sin mensajes");
      }
    } else {
      console.log("sin mensajes");
    }
    return text;
  }

  SendMessageWtspp = async (data) => {
    console.log({ data });
    try {
      const url = 'https://graph.facebook.com/v19.0/325486840648107/messages';
      const token = config.tokenWtspp; //! conseguir token permanente

      await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Mensaje enviado:', data);
    } catch (error) {
      console.log({ error });
      console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
    }
  }

  Process = async (textUser, number) => {
    textUser = textUser.toLowerCase();
    let models = [];


    //#region sin gemini
    // //Hola que tal
    // if (textUser.includes("hola")) {
    //   //SALUDAR
    //   const model = MessageText("hello, nice to me you", number);
    //   models.push(model);
    //   const listModel = MessageText("you are welcome", number);
    //   models.push(listModel);
    // } else if (textUser.includes("gracias")) {
    //   const model = MessageText("you are welcome", number);
    //   models.push(model);
    // } else if (textUser.includes("adios")) {
    //   const model = MessageText("bye bye", number);
    //   models.push(model);
    // } else if (textUser.includes("comprar")) {
    //   const model = messageButtons("Que quieres comprar?", number);
    //   models.push(model);
    // } else if (textUser.includes("vender")) {
    //   const model = MessageText("puedes vender x aca", number);
    //   models.push(model);
    // } else {
    //   const model =  MessageText("I do not know", number);
    //   models.push(model);
    // }
    // #endregion

    // #region con gemini
    try { //! refactorisar para poder utilizar el sistema de identificacion de historial.
      let data = await this.getAll();
      const redis = new RedisServices()
      const redisItemToken = await redis.getItem(number)

      //! pra crear los historiales de los chat en redis se van a hacer con el numero de celular
      const dataPrev = data.map(item => {
        const { _id, ...Data } = item;
        return Data._doc.Data;
      });
      const dataString = JSON.stringify(dataPrev);
      const response = await this.geminiGeneration(textUser, dataString, redisItemToken);
      if (response !== null) {
        const model = MessageText(response, number);
        models.push(model)
        
      } else {
        const model = wtsppModels.MessageText("Lo siento algo salio mal intesta mas tarde", number);
        models.push(model)
      }
      if (!redisItemToken) {
        await redis.createItem(`  Message: ${textUser}, Response: ${response}`, number, 300)
      } else {
        console.log({"UpdateItem":redisItemToken});
        await redis.updateItem(`  Message: ${textUser}, Response: ${response}`, number )
      }
      models.forEach(async (model) => {
        this.SendMessageWtspp(model);
        console.log({ model });
      })

    } catch (error) {
      console.error(error);
    }
  }

}
// #endregion
