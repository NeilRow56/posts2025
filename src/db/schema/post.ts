import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { categories } from './category'
import { users } from './user'
import { relations } from 'drizzle-orm'
import { comments } from './comment'
import { postTags } from './post-tags'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  shortDescription: text('short_description'),
  content: text('content').notNull(),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
})

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id]
  }),
  tags: many(postTags),
  comments: many(comments),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id]
  })
}))

// Each post relates to one user , who created the post
// A post can have many tags and comments
//A post can only have one category
