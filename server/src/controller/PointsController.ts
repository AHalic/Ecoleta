import { Request, Response } from 'express';
import knex from '../database/connections';

class PointsController {
    async get(req:Request, res:Response){
        // TODO: verificar se o query param é vazio e retornar todos os pontos
        // verificar variaveis vazias (possibilidade de usar alguns dos filtros)

        const { city, uf, items } = req.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            //  todos os pontos que tem pelo menos um dos items que estao na lista
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
    
        return res.json(points);
    }

    async index(req:Request, res:Response){
        const { id }  = req.params;

        // podemos usar first pq sabemos q o id é unico
        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({ message: 'Point not found.' });
        }
        
        // SELECT * FROM items
        // JOIN point_items ON items.id = point_items.item_id
        // WHERE point_items.point_id = {id}
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({point, items});
    }
    
    async create(req:Request, res:Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        // transaction: se um der erro na ultima, todos os outros também deverão dar
        const trx = await knex.transaction();
    
        const point = {
            image: 'image-fake',
            name, 
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert({
            image: 'image-fake',
            name, // name: name
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        });
    
        await trx('point_items').insert(items.map((item_id: number) => {
            return {
            item_id,
            point_id: insertedIds[0]
            }})
        );
            
        await trx.commit();

        return res.json({
            id: insertedIds[0],
            ...point 
        });
    };
}

export default PointsController;