import {
  pgTable,
  serial,
  varchar,
  timestamp,
  date,
  boolean,
} from 'drizzle-orm/pg-core';

export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  staffId: varchar('staff_id', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 100 }).notNull(), // e.g., 'librarian', 'admin', 'teacher'
  department: varchar('department', { length: 100 }),
  address: varchar('address', { length: 500 }),
  hiredDate: date('hired_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
