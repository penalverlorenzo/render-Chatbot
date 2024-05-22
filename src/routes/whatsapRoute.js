import {Router} from 'express';
import { verifyToken, RecievedMsg } from '../controllers/whatsappcontrollers';


export const whatsappRouter = Router()

whatsappRouter.get("/", verifyToken)
whatsappRouter.post("/", RecievedMsg)

