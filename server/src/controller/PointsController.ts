import { Request, Response } from 'express';
import knex from '../database/connections';
import removeAccents from 'remove-accents';

class PointsController {
    async get(req:Request, res:Response){
        const { city, uf, items } = req.query;

        // if no filter was passed, return all points
        if (!city && !uf && !items){
            const points = await knex('points')
            .select('points.*');

            return res.json(points);
        }

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .where((qb) => {
                if(city){
                    qb.where('city', removeAccents(String(city).toLowerCase()))
                }
                if(uf){
                    qb.where('uf', String(uf).toUpperCase())
                }
                if(items){
                    //  todos os pontos que tem pelo menos um dos items que estao na lista
                    const parsedItems = String(items)
                        .split(',')
                        .map(item => Number(item.trim()));
                    qb.whereIn('point_items.item_id', parsedItems)
                }})
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
            image,
            name,
            email,
            celular,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        // transaction: se um der erro na ultima, todos os outros também deverão dar
        const trx = await knex.transaction();
    
        const point = {
            image,
            name, 
            email,
            celular,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert({
            image,
            name, // name: name
            email,
            celular,
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

    async delete(req:Request, res:Response){
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({ message: 'Point not found.' });
        }

        await knex('point_items').where('point_id', id).delete();
        await knex('points').where('id', id).delete();

        return res.json({ message: 'Point deleted.' });
    };
}

export default PointsController;