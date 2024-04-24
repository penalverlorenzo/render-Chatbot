import './db/database.js';
import express from 'express';
import cors from 'cors';

import { router } from './routes/info.js';
import bodyParser from 'body-parser';
import { config } from './config/index.js';


const app = express();
const PORT = config.port|| 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));



app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());

app.use('/api/v1', router)


app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});


