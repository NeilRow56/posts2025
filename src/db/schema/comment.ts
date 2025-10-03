import {
  AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core'
import { users } from './user'

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  // parentId is used so that a reply to a commment can be referenced back to that comment
  parentId: integer('parent_id').references((): AnyPgColumn => comments.id),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  postId: integer('post_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
})
