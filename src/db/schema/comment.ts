import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id'),
  userId: integer('user_id').notNull(),
  content: text('content').notNull(),
  postId: integer('post_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
})
