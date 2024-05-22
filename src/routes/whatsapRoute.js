import {Router} from 'express';
// import { verifyToken, RecievedMsg } from '../controllers/whatsappcontrollers.js';
import * as wc from '../controllers/whatsappcontrollers.js';


export const whatsappRouter = Router()

whatsappRouter.get("/", wc.verifyToken)
// whatsappRouter.get("/", verifyToken)
// whatsappRouter.post("/", RecievedMsg)
whatsappRouter.post("/", wc.RecievedMsg)

