import {
  AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core'
import { users } from './user'
import { relations } from 'drizzle-orm'
import { posts } from './post'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  // parentId is used so that a reply to a commment can be referenced back to that comment
  parentId: integer('parent_id').references((): AnyPgColumn => comments.id),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  postId: integer('post_id')
    .references(() => posts.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
})

//Each commment is linked to one user and one post
export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  })
}))

export const commentSchema = createInsertSchema(comments, {
  postId: schema => schema.min(1, { error: 'The postId must be provided' }),
  content: schema => schema.min(1),
  userId: schema => schema.min(1)
}).pick({
  postId: true,
  content: true,
  parentId: true,
  userId: true,
  id: true
})
export type CommentSchema = z.infer<typeof commentSchema>

// We use "pick" so that zod knows we do not need to enter the createdAt and updatedAt values - even though the table describes them as "notNull"
