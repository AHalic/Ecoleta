import express, { response } from 'express';

const app = express();

app.get('/users', (req, res) => {
    console.log('Listagem de usuários');

    response.json([
        'Diego',
        'Cleiton',
        'Robson',
        'Daniel'
    ]);
});

app.listen(3333);

// run the program as:
// npm run dev