import {Router} from 'express';
import { RecievedMsg, verifyToken } from '../controllers/whatsappcontrollers';
// import { verifyToken, RecievedMsg } from '../controllers/whatsappcontrollers.js';




export const whatsappRouter = Router()
whatsappRouter.get("/", async (req,res)=> {
    const response = verifyToken()
    return response
})

// whatsappRouter.get("/", verifyToken)
// whatsappRouter.post("/", RecievedMsg)
whatsappRouter.post("/", (req,res)=>{
    const response = RecievedMsg()
    return response
})

