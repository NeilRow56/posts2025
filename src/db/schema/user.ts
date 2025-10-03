import { InferSelectModel, relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { posts } from './post'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

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

const baseSchema = createInsertSchema(users, {
  fullName: schema => schema.min(1),
  password: schema => schema.min(1),
  age: z.coerce.number().min(18).max(99),
  email: z.email().min(1, { error: 'Invalid email format' })
}).pick({ fullName: true, password: true, age: true, email: true })

export const userSchema = z.union([
  z.object({
    mode: z.literal('signUp'),
    email: baseSchema.shape.email,
    password: baseSchema.shape.password,
    fullName: baseSchema.shape.fullName,
    age: baseSchema.shape.age
  }),
  z.object({
    mode: z.literal('signIn'),
    email: baseSchema.shape.email,
    password: baseSchema.shape.password
  }),
  z.object({
    mode: z.literal('update'),
    fullName: baseSchema.shape.fullName,
    age: baseSchema.shape.age,
    id: z.number().min(1)
  })
])

export type UserSchema = z.infer<typeof userSchema>
export type SelectUserModel = InferSelectModel<typeof users>
