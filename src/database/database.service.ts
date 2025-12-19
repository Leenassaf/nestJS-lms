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
    const connectionString =
      this.configService.get<string>('DATABASE_URL') ||
      `postgresql://${this.configService.get<string>('POSTGRES_USER') || 'postgres'}:${this.configService.get<string>('POSTGRES_PASSWORD') || 'postgres'}@${this.configService.get<string>('POSTGRES_HOST') || 'localhost'}:${this.configService.get<number>('POSTGRES_PORT') || 5432}/${this.configService.get<string>('POSTGRES_DB') || 'nestjs_lms'}`;

    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

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
