import Knex from 'knex'

export async function up(knex: Knex) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return knex.raw('CREATE EXTENSION IF NOT EXISTS citext;')
    })
    .then(() => {
      return knex.schema.createTable('users', (table) => {
        table.specificType('id', 'serial').primary()
        table.text('password_hash').notNullable()
        table.text('salt').notNullable()
        table.specificType('username', 'citext').unique().notNullable()
        table.text('full_name')
        table.timestamp('created_at').defaultTo(knex.raw('now()'))
        table.timestamp('updated_at').defaultTo(knex.raw('now()'))
      }).createTable('files', (table) => {
        table.uuid('id').primary().notNullable()
        table.text('name').nullable()
        table.timestamp('created_at').notNullable()
        table.integer('size').nullable()
        table.text('mimetype').notNullable()
        table.text('url').notNullable()
        table.boolean('deleted')
      }).createTable('chats', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.timestamp('created_at').defaultTo(knex.raw('now()'))
        table.integer('owner_id').references('id').inTable('users').notNullable().onUpdate('CASCADE').onDelete('CASCADE')
        table.text('name').notNullable()
      }).createTable('chat_members', (table) => {
        table.uuid('chat_id').notNullable().references('id').inTable('chats').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('user_id').notNullable()
        table.primary(['chat_id', 'user_id'])
        table.index(['chat_id', 'user_id'])
      }).createTable('messages', (table) => {
        table.specificType('id', 'serial').primary()
        table.uuid('chat_id').notNullable().references('id').inTable('chats').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('sender').notNullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('recipient').notNullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
        table.timestamp('created_at').defaultTo(knex.raw('now()')).notNullable()
        table.timestamp('delivered_at')
        table.timestamp('seen_at')
        table.uuid('file_id').references('id').inTable('files').onUpdate('CASCADE')
        table.text('text')
        table.boolean('deleted').defaultTo(false)
        table.index(['chat_id'])
      })
    }).then(() => {
      return knex.raw(`
        ALTER TABLE messages ADD CONSTRAINT text_file CHECK(text IS NOT NULL OR file_id IS NOT NULL)
      `)
    })
};

export async function down(knex: Knex) {
   await Promise.all([
    knex.schema.dropTableIfExists('chat_members'),
    knex.schema.dropTableIfExists('messages')
  ])

  await Promise.all([
    knex.schema.dropTableIfExists('chats'),
    knex.schema.dropTableIfExists('files'),
    knex.schema.dropTableIfExists('users')
  ])
  return 
};