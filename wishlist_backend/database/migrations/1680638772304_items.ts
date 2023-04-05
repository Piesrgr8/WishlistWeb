import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'items'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name')
            table.string('url').notNullable()
            table.string('desc')
            //these add foreign keys for users and topics
            table.integer('user_id').unsigned().notNullable().references('users.id')
            table.integer('wishlist_id').unsigned().notNullable().references('wishlists.id')
            table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
            table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
