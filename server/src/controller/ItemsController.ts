import knex from "../database/connections";
import { Request, Response } from 'express';

class ItemsController {
    async get(req:Request, res:Response) {
        // usa await pois demora um pouco e deve esperar o resultado para prosseguir
        // SELECT * FROM items
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        });
    
        return res.json(serializedItems);
    }
}

export default ItemsController;