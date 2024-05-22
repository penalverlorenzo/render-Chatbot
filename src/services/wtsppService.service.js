import https from "https";

export class WtsppService {
  VerifyToken = ( req, res) => {

    try {
      const accessToken = "Z9ES8DXF7CG6V5JHBKN";
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];
  
      if (challenge != null && token != null && token == accessToken) {
        res.send(challenge);
      }else {
        res.status(400).send();
      }
      
    } catch (error) {
      res.status(400).send()
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
          await processMessage.Process(text, number)
        }
      }
      res.send("EVENT_RECEIVED")
    } catch (error) {
      res.send("EVENT_RECEIVED")
    }
  }

  getTextMessage = (message) => {
    let text = "";
    const typeMessage = message["type"];
    if (typeMessage == "text") {
      text = (message["text"])["body"]
    } else if (typeMessage == "interactive"){
      const interactiveObject = message["interactive"];
      const typeInteractive = interactiveObject["type"];
  
      if (typeInteractive === "button_reply") {
      text = (interactiveObject["button_replay"])["title"];
      } else if (typeInteractive === "list_reply") {
        text = (interactiveObject["list_reply"])["title"];
      }else {
        console.log("sin mensajes");
      }
    } else {
      console.log("sin mensajes");
    }
    return text;
  }

  SendMessageWtspp = (data) => {

    const options = {    
      host: "graph.facebook.com",
      path: "v19.0/321829781013280/messages",
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 'token permanente'"
      }
    };
  
    const req = https.request(options, res => {
      res.on("data", d=> {
        process.stdout.write(d);
      })
    });
  
    req.on("error", err => {
      console.error(err);
    }) 
  
    req.write(data);
    req.end();
  }
  
}
