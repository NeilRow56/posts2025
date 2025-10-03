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
import { InferSelectModel, relations } from 'drizzle-orm'
import { comments } from './comment'
import { postTags } from './post-tags'
import z from 'zod'
import { createInsertSchema } from 'drizzle-zod'

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

const baseSchema = createInsertSchema(posts, {
  title: schema => schema.min(1),
  shortDescription: schema => schema.min(1).max(255),
  userId: schema => schema.min(1),
  categoryId: schema => schema.min(1)
}).pick({
  title: true,
  shortDescription: true,
  userId: true,
  categoryId: true,
  content: true
})

export const postSchema = z.union([
  z.object({
    mode: z.literal('create'),
    title: baseSchema.shape.title,
    shortDescription: baseSchema.shape.shortDescription,
    userId: baseSchema.shape.userId,
    categoryId: baseSchema.shape.categoryId,
    content: baseSchema.shape.content,
    tagIds: z.array(z.number())
  }),
  z.object({
    mode: z.literal('edit'),
    id: z.number().min(1),
    title: baseSchema.shape.title,
    shortDescription: baseSchema.shape.shortDescription,
    userId: baseSchema.shape.userId,
    categoryId: baseSchema.shape.categoryId,
    content: baseSchema.shape.content,
    tagIds: z.array(z.number())
  })
])

export type PostSchema = z.infer<typeof postSchema>
export type SelectPostModel = InferSelectModel<typeof posts>

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
