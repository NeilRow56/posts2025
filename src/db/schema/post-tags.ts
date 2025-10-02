import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

export const postTags = pgTable(
  'post_to_tag',
  {
    postId: integer('post_id').notNull(),

    tagId: integer('tag_id').notNull()
  },
  table => [primaryKey({ columns: [table.postId, table.tagId] })]
)
