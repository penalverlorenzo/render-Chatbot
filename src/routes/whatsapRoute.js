import {Router} from 'express';
import { recievedMsg, verifyToken } from '../controllers/whatsappcontrollers';
// import { verifyToken, RecievedMsg } from '../controllers/whatsappcontrollers.js';




export const whatsapprouter = Router()
whatsapprouter.get("/", async (req,res)=> {
    const response = verifyToken()
    return response
})

// whatsapprouter.get("/", verifyToken)
// whatsapprouter.post("/", RecievedMsg)
whatsapprouter.post("/", (req,res)=>{
    const response = recievedMsg()
    return response
})

