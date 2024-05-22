export const MessageText = ( textResponse, number ) => {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "text": {
      "preview": true,
      "body": textResponse
    },
    "type": "text",
  });
  return data;
}

export const messageButtons = ( question, number ) => {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": question
      },
      "action": {
        "buttons": [
          {
            "type": "reply",
            "reply": {
            "id": "001",
            "title": "si",
                  },
          },
          {
            "type": "reply",
            "reply": {
            "id": "002",
            "title": "no",
                  },
          }
        ]
      }
      
    },
  });
  return data;
}

export const messageList = ( number ) => {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": "Tengo estas opciones"
      },
      "footer": {
        "text": "Seleccione una de las opciones para poder atenderte"
      },
      "action": {
        "buttons": "Ver opciones",
        "sections": [
          {
            "title": "Compra y vende productos",
            "row": [
                {
                  "id": "main-compras",
                  "title": "Compras",
                  "description": "Compra los mejores productos de tu hogar" 
                },
                {
                  "id": "main-vender",
                  "title": "Vender",
                  "description": "Vende tus productos" 
                },
            ],
          },
          {
            "title": "Centro de atencion",
            "row": [
                {
                  "id": "main-agencia",
                  "title": "Agencia",
                  "description": "puedes visitar nuestra agencia" 
                },
                {
                  "id": "main-contacto",
                  "title": "Centro de contacto",
                  "description": "Te atendera uno de nuestros agentes" 
                },
            ],
          },
        ]
      }
      
    },
  });
  return data;
}

export const messageLocation = ( latitude, longitude, name, address, number ) => {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "location",
    "location": {
      "latitude": latitude,
      "longitude": longitude,
      "name": name,
      "address": address
    },
  });
  return data;
}