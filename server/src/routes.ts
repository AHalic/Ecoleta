import express from 'express';


const routes = express.Router();

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

export default routes;


/*
// Query param: parametro (não obrigatorio) enviado na rota apos o "?" (filtros, paginação)
app.get('/users', (req, res) => {
    const search = String(req.query.search);

    const filteredUsers = search ? users.filter(user => user.toUpperCase().includes(search.toUpperCase())) : users;

    return res.json(filteredUsers);
});

// Request param: parametro (vindo da propria rota) que identifica um recurso
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    const user = users[id];

    return res.json(user);
});

// Body param: parametro (vindo do corpo da requisição) que identifica um recurso
app.post('/users', (req, res) => {
    const user = req.body;

    return res.json(user);
});
*/

