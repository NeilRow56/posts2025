import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { posts } from './post'

export const users = pgTable('users', {
  id: serial('id').notNull().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  age: integer('age').notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
})

// Each user could have many posts
export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))
