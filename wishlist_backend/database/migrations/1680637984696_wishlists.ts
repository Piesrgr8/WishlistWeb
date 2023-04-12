import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'wishlists'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            //create an auto incremented id
            table.increments('id')
            //create a name column
            table.string('name').unique().notNullable()
            table.string('url').unique()
            //create a column for description
            table.text('description').notNullable()
            //create a reference to the user table
            table
                .integer('user_id')
                .unsigned()
                .references('users.id')
                .onDelete('RESTRICT')
                .notNullable()
            table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
            table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
