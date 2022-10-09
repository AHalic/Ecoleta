import express from 'express';
import routes from './routes';

// run the program as:
// npm run dev

const app = express();
app.use(express.json());



app.listen(3333);