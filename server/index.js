import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connection } from './connection.js';
import { postsRouter } from './routes/postsRouter.js';
import { usersRouter } from './routes/usersRouter.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

connection();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello to Memories API');
})

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})