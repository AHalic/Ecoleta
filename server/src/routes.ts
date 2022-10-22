import express from 'express';

import PointsController from './controller/PointsController';
import ItemsController from './controller/ItemsController';

import multer from 'multer';
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.get);

// no isnomnia usar multipart/form-data para anexar imagens
// a lista de itens deve passar por um trim
// o arquivo deve ser passado como atributo chamado 'image_file'
routes.post('/points', upload.single('image_file'), pointsController.create);

routes.get('/points', pointsController.get);
routes.get('/points/:id', pointsController.index);
routes.delete('/points/:id', pointsController.delete);

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

