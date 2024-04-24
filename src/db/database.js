import mongoose from "mongoose";

import { config } from "../config/index.js";

const URI = config.mongodbURL

const connection = mongoose.connect(URI).then( () => console.log('Successfully connected')
).catch(e => console.error(e))

