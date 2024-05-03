import './db/database.js';
import express from 'express';
import cors from 'cors';

import { infoRouter, } from './routes/info.js';
import bodyParser from 'body-parser';
import { config } from './config/index.js';
import { tokenRouter } from './routes/tokens.js';


const app = express();
const PORT = config.port|| 3000;

app.use(cors({
    origin: config.hostIA,
}));



app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());

app.use('/api/v1', tokenRouter)
app.use('/api/v1', infoRouter)


app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});


