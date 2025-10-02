import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const category = pgTable('category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

export const categorySchema = createInsertSchema(category)
export type CategorySchema = z.infer<typeof categorySchema>
