import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {pool} from './database/db';
import { start } from 'repl';
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'
import musicRouter from './routes/musicRouter'

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const startServer = async () => {
    try {
        const client = await pool.connect();
        console.log(`Connection with the database established 🟢`)
        client.release();
        app.use("/api", authRouter, userRouter, musicRouter)

        app.listen(8080, () => {
            console.log(`Server is running on portrt ${PORT}`);
        });
        
    } catch (error) {
        console.error("Error starting servesssr:", error);
    }
}

startServer();