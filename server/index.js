import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connection } from './connection.js';
import { postsRouter } from './routes/postsRouter.js';
import { usersRouter } from './routes/usersRouter.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

connection();

const PORT = process.env.PORT || 8000;

app.get('/*', (req, res) => {
    let url = path.join(__dirname, '../client/build', 'index.html');
    if (!url.startsWith('/app/'))
      url = url.substring(1);
    res.sendFile(url);
  });

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})