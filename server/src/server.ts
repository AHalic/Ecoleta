import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';

// run the program as:
// npm run dev

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// para acessar as imagens ou pdfs de forma estatica
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333);