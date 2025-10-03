import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { posts } from './post'
import { users } from './user'
import { relations } from 'drizzle-orm'
import { tags } from './tag'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

export const postTags = pgTable(
  'post_to_tag',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id),

    tagId: integer('tag_id')
      .notNull()
      .references(() => users.id)
  },
  table => [primaryKey({ columns: [table.postId, table.tagId] })]
)

export const postTagsRelations = relations(postTags, ({ one }) => ({
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
  posts: one(posts, { fields: [postTags.postId], references: [posts.id] })
}))

export const postTagSchema = createInsertSchema(postTags)
export type PostTagsSchema = z.infer<typeof postTagSchema>

// THE ABOVE TABLE IS CREATED TO HELP UTILISE THE RELATIONSHIP BETWEEN POSTS AND TAGS

//A POST MIGHT HAVE MULTIPLE TAGS
//A TAG MIGHT RELATE TO MULTIPLE POSTS

// Key characteristics of blog tags:

//Specificity:
//Tags are more detailed than categories, describing a single, specific idea within a post.

//Keywords:
//They function as keywords that relate to the blog post's content.
//Linking:
//Tags create a link to a page that displays all posts sharing that specific tag, facilitating deeper exploration of topics.
//Organization:
//They act as "labels" to organize and group content around precise subjects, making a blog easier to navigate.
