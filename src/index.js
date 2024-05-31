import './db/database.js';
import express from 'express';
import cors from 'cors';

import { infoRouter, } from './routes/public/info.js';
import bodyParser from 'body-parser';
import { config } from './config/index.js';
import { tokenRouter } from './routes/tokens.js';
import { redisRouter } from './routes/redisRouter.js';
import { userRouter } from './routes/private/users.js';
import { infoPrivateRouter } from './routes/private/infoPrivate.js';
import { whatsAppRoutes } from './routes/public/whatsApp.js';


const app = express();
const PORT = config.port|| 3000;

app.use(cors({
    origin: config.hostIA,
}));


app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());

app.use("/api/v1/whatsapp", whatsAppRoutes);
app.use('/api/v1', tokenRouter)
app.use('/api/v1', redisRouter)
app.use('/api/v1', infoRouter)
app.use('/api/v1/private', userRouter)
app.use('/api/v1/private', infoPrivateRouter)


app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});


