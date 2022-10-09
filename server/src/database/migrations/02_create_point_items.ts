import { knex, Knex } from 'knex';

export async function up(knex: Knex) {
    console.log('Creating items table...')

    // CRIAR TABELA
    return knex.schema.createTable('point_items', (table: any) => {
        table.increments('id').primary();
        table.integer('point_id')
            .notNullable()
            .references('id') // Chave estrangeira pra id da tabela points
            .inTable('points');
        table.integer('item_id')
            .notNullable()
            .references('id') // Chave estrangeira pra id da tabela item
            .inTable('items');
    });
}

export async function down(knex: Knex) {
    console.log('Deleting items table...')

    // VOLTAR ATRÁS (DELETAR TABELA)
    return knex.schema.dropTable('point_items');
}