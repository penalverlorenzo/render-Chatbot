import {Router} from 'express';
import { recievedMsg, verifyToken } from '../controllers/whatsappcontrollers';
// import { verifyToken, RecievedMsg } from '../controllers/whatsappcontrollers.js';




export const whatsappRouter = Router()
whatsappRouter.get("/", async (req,res)=> {
    const response = verifyToken()
    return response
})

// whatsappRouter.get("/", verifyToken)
// whatsappRouter.post("/", RecievedMsg)
whatsappRouter.post("/", (req,res)=>{
    const response = recievedMsg()
    return response
})

