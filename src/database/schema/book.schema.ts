import {
  pgTable,
  serial,
  varchar,
  timestamp,
  date,
  boolean,
  integer,
  text,
} from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  isbn: varchar('isbn', { length: 20 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  publisher: varchar('publisher', { length: 255 }),
  publishedDate: date('published_date'),
  genre: varchar('genre', { length: 100 }),
  description: text('description'),
  totalCopies: integer('total_copies').default(1).notNull(),
  availableCopies: integer('available_copies').default(1).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  location: varchar('location', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
