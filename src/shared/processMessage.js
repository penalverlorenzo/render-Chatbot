// const chatGPTServices = require('../services/chatGPT.service'); gmini

import { WtsppService } from "../services/wtsppService.service";
import { MessageText, messageButtons } from "./whatsApp.modes";

const service = new WtsppService();

export const Process = async (textUser, number)=> {
  textUser= textUser.toLowerCase();
  let models = [];


  //#region sin gemini
  //Hola que tal
  if (textUser.includes("hola")) {
    //SALUDAR
    const model = MessageText("hello, nice to me you", number);
    models.push(model);
    const listModel = MessageText("you are welcome", number);
    models.push(listModel);
  } else if (textUser.includes("gracias")) {
    const model = MessageText("you are welcome", number);
    models.push(model);
  } else if (textUser.includes("adios")) {
    const model = MessageText("bye bye", number);
    models.push(model);
  } else if (textUser.includes("comprar")) {
    const model = messageButtons("Que quieres comprar?", number);
    models.push(model);
  } else if (textUser.includes("vender")) {
    const model = MessageText("puedes vender x aca", number);
    models.push(model);
  } else {
    const model = messageLocation(latitude, longitude, name, address, number);
    models.push(model);
  }
  // #endregion

  //#region con gemini
  // const responseChatGPT = await chatGPTServices.GetMessageChatGPT(textUser)
  // if (responseChatGPT !== null) {
  //   const model = MessageText(responseChatGPT, number);
  //   models.push(model)
  // } else {
  //   const model = wtsppModels.MessageText("Lo siento algo salio mal intesta mas tarde", number);
  //   models.push(model)
  // }
  
  // #endregion
  

  models.forEach(model => {
    service.SendMessageWtspp(model);
  })
}
