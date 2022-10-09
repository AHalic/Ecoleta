import { knex, Knex } from 'knex';

export async function up(knex: Knex) {
    console.log('Creating items table...')

    // CRIAR TABELA
    return knex.schema.createTable('items', (table: any) => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(knex: Knex) {
    console.log('Deleting items table...')

    // VOLTAR ATRÁS (DELETAR TABELA)
    return knex.schema.dropTable('items');
}