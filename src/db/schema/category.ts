import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { posts } from './post'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

// Each category could have many posts
export const categoryRelations = relations(categories, ({ many }) => ({
  posts: many(posts)
}))

export const categorySchema = createInsertSchema(categories)
export type CategorySchema = z.infer<typeof categorySchema>
