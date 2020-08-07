exports.up = function(knex) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return knex.raw('CREATE EXTENSION IF NOT EXISTS citext;')
    })
    .then(() => {
      return knex.schema.createTable('chats', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.timestamp('created_at').defaultTo(knex.raw('now()'))
        table.text('owner_id').notNullable()
        table.text('name').notNullable()
        table.timestamp('updated_at').defaultTo(knex.raw('now()'))
      }).createTable('chat_members', (table) => {
        table.uuid('chat_id').notNullable().references('id').inTable('chats').onUpdate('CASCADE').onDelete('CASCADE')
        table.text('user_id').notNullable()
        table.primary(['chat_id', 'user_id'])
        table.index(['user_id'])
        table.index(['chat_id'])
      }).createTable('messages', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.uuid('chat_id').notNullable().references('id').inTable('chats').onUpdate('CASCADE').onDelete('CASCADE')
        table.text('sender_id').notNullable()
        table.text('reciever_id').notNullable()
        table.timestamp('sent_at').defaultTo(knex.raw('now()')).notNullable()
        table.timestamp('delivered_at')
        table.timestamp('seen_at')
        table.text('message').notNullable()
        table.boolean('deleted').defaultTo(false)
        table.index(['chat_id', 'sent_at'])
      })
    })
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('chat_members'),
    knex.schema.dropTableIfExists('messages') 
  ]).then(() => {
    return knex.schema.dropTableIfExists('chats') 
  })
};