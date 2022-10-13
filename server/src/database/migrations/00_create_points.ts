import { knex, Knex } from 'knex';


export async function up(knex: Knex) {
    console.log('Creating points table...')

    // CRIAR TABELA
    return knex.schema.createTable('points', (table: any) => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('celular').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    });

}

export async function down(knex: Knex) {
    console.log('Deleting points table...')

    // VOLTAR ATRÁS (DELETAR TABELA)
    return knex.schema.dropTable('points');
}