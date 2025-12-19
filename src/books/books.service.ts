import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { books } from '../database/schema';
import { eq, and, ne } from 'drizzle-orm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private databaseService: DatabaseService) {}

  async create(createBookDto: CreateBookDto) {
    // Check if ISBN already exists
    const [existingBook] = await this.databaseService.db
      .select()
      .from(books)
      .where(eq(books.isbn, createBookDto.isbn))
      .limit(1);

    if (existingBook) {
      throw new ConflictException(
        `Book with ISBN ${createBookDto.isbn} already exists`,
      );
    }

    const totalCopies = createBookDto.totalCopies ?? 1;
    const availableCopies = totalCopies;

    const [newBook] = await this.databaseService.db
      .insert(books)
      .values({
        isbn: createBookDto.isbn,
        title: createBookDto.title,
        author: createBookDto.author,
        publisher: createBookDto.publisher,
        publishedDate: createBookDto.publishedDate || undefined,
        genre: createBookDto.genre,
        description: createBookDto.description,
        totalCopies,
        availableCopies,
        isAvailable: true,
        location: createBookDto.location,
      })
      .returning();

    return newBook;
  }

  async findAll() {
    return this.databaseService.db.select().from(books);
  }

  async findOne(id: number) {
    const [book] = await this.databaseService.db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    // Check if book exists
    const [existingBook] = await this.databaseService.db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Check if ISBN is being updated and if it conflicts with another book
    if (updateBookDto.isbn && updateBookDto.isbn !== existingBook.isbn) {
      const [bookWithIsbn] = await this.databaseService.db
        .select()
        .from(books)
        .where(and(eq(books.isbn, updateBookDto.isbn), ne(books.id, id)))
        .limit(1);

      if (bookWithIsbn) {
        throw new ConflictException(
          `Book with ISBN ${updateBookDto.isbn} already exists`,
        );
      }
    }

    // Validate available copies doesn't exceed total copies
    const totalCopies = updateBookDto.totalCopies ?? existingBook.totalCopies;
    const availableCopies =
      updateBookDto.availableCopies ?? existingBook.availableCopies;

    if (availableCopies > totalCopies) {
      throw new BadRequestException(
        'Available copies cannot exceed total copies',
      );
    }

    // Update isAvailable based on availableCopies
    const isAvailable =
      updateBookDto.isAvailable !== undefined
        ? updateBookDto.isAvailable
        : availableCopies > 0;

    const updateData: {
      isbn?: string;
      title?: string;
      author?: string;
      publisher?: string;
      publishedDate?: string;
      genre?: string;
      description?: string;
      totalCopies?: number;
      availableCopies?: number;
      isAvailable?: boolean;
      location?: string;
      updatedAt?: Date;
    } = {
      isbn: updateBookDto.isbn,
      title: updateBookDto.title,
      author: updateBookDto.author,
      publisher: updateBookDto.publisher,
      publishedDate: updateBookDto.publishedDate,
      genre: updateBookDto.genre,
      description: updateBookDto.description,
      totalCopies,
      availableCopies,
      isAvailable,
      location: updateBookDto.location,
      updatedAt: new Date(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) =>
        updateData[key as keyof typeof updateData] === undefined &&
        delete updateData[key as keyof typeof updateData],
    );

    const [updatedBook] = await this.databaseService.db
      .update(books)
      .set(updateData)
      .where(eq(books.id, id))
      .returning();

    return updatedBook;
  }

  async remove(id: number) {
    const [book] = await this.databaseService.db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    await this.databaseService.db.delete(books).where(eq(books.id, id));

    return { message: `Book with ID ${id} has been deleted` };
  }
}
