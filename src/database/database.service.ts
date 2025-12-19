import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: ReturnType<typeof drizzle>;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    const user = this.configService.get<string>('POSTGRES_USER') || 'postgres';
    const password =
      this.configService.get<string>('POSTGRES_PASSWORD') || 'postgres';
    const host = this.configService.get<string>('POSTGRES_HOST') || 'localhost';
    const port = this.configService.get<number>('POSTGRES_PORT') || 5432;
    const database =
      this.configService.get<string>('POSTGRES_DB') || 'nestjs_lms';

    // Use connection string if provided and valid, otherwise use individual parameters
    if (
      connectionString &&
      connectionString.trim() &&
      !connectionString.includes('${')
    ) {
      // Valid connection string provided
      this.pool = new Pool({
        connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: false, // Disable SSL for local development
      });
    } else {
      // Use individual parameters
      this.pool = new Pool({
        user,
        password,
        host,
        port,
        database,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: false, // Disable SSL for local development
      });
    }

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
      // eslint-disable-next-line no-console
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
