import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class UpdateBookDto {
  @ApiPropertyOptional({
    description: 'ISBN number of the book',
    example: '978-0-123456-78-9',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  isbn?: string;

  @ApiPropertyOptional({
    description: 'Title of the book',
    example: 'The Great Gatsby',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional({
    description: 'Author of the book',
    example: 'F. Scott Fitzgerald',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  author?: string;

  @ApiPropertyOptional({
    description: 'Publisher name',
    example: 'Scribner',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  publisher?: string;

  @ApiPropertyOptional({
    description: 'Publication date',
    example: '1925-04-10',
  })
  @IsDateString()
  @IsOptional()
  publishedDate?: string;

  @ApiPropertyOptional({
    description: 'Genre of the book',
    example: 'Fiction',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  genre?: string;

  @ApiPropertyOptional({
    description: 'Book description',
    example: 'A classic American novel...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Total number of copies',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  totalCopies?: number;

  @ApiPropertyOptional({
    description: 'Available number of copies',
    example: 3,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  availableCopies?: number;

  @ApiPropertyOptional({
    description: 'Availability status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Physical location in library',
    example: 'A-101',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;
}
