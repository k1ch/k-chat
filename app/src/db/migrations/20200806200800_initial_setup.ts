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
      }).createTable('channels', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.timestamp('created_at').defaultTo(knex.raw('now()'))
        table.text('name').notNullable()
      }).createTable('channel_member_types', (table) => {
        table.text('type').primary()
      }).createTable('channel_members', (table) => {
        table.uuid('channel_id').notNullable().references('id').inTable('channels').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('user_id').notNullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
        table.text('type').references('type').inTable('channel_member_types').onUpdate('CASCADE').notNullable().defaultTo('member')
        table.primary(['channel_id', 'user_id'])
        table.index(['channel_id', 'user_id'])
      }).createTable('message_content_types', (table) => {
        table.text('type').primary()
      }).createTable('messages', (table) => {
        table.specificType('id', 'serial').primary()
        table.uuid('channel_id').references('id').inTable('channels').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('sender').notNullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('recipient').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
        table.timestamp('created_at').defaultTo(knex.raw('now()')).notNullable()
        table.timestamp('delivered_at')
        table.timestamp('seen_at')
        table.uuid('file_id').references('id').inTable('files').onUpdate('CASCADE')
        table.text('content_type').references('type').inTable('message_content_types').onUpdate('CASCADE').notNullable()
        table.text('text')
        table.boolean('deleted').defaultTo(false)
        table.index(['channel_id'])
      })
    }).then(async () => {
      await knex('channel_member_types').insert([{
        type: 'member'
      }, {
        type: 'owner'
      }, {
        type: 'admin'
      }])
      await knex('message_content_types').insert([{
        type: 'text'
      }, {
        type: 'video'
      }, {
        type: 'image'
      }, {
        type: 'audio'
      }])
      await knex.raw(`
        ALTER TABLE messages ADD CONSTRAINT content_type_check CHECK((content_type!='text' AND file_id IS NOT NULL) OR (content_type='text' AND text IS NOT NULL));
        ALTER TABLE messages ADD CONSTRAINT text_file CHECK(text IS NOT NULL OR file_id IS NOT NULL);
        ALTER TABLE messages ADD CONSTRAINT channel_recipient CHECK((channel_id IS NULL AND recipient IS NOT NULL) OR (channel_id IS NOT NULL AND recipient IS NULL));
      `)
      return
    })
};

export async function down(knex: Knex) {
  await Promise.all([
    knex.schema.dropTableIfExists('channel_members'),
    knex.schema.dropTableIfExists('messages')
  ])

  await Promise.all([
    knex.schema.dropTableIfExists('channels'),
    knex.schema.dropTableIfExists('message_content_types'),
    knex.schema.dropTableIfExists('channel_member_types'),
    knex.schema.dropTableIfExists('files'),
    knex.schema.dropTableIfExists('users')
  ])
  return
};