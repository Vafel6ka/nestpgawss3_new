import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from './client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  // Prisma client instance - use this.prismaService.client.modelName in your services
  readonly client = prisma;

  async onModuleInit() {
    await this.client.$connect().catch((error: Error) => {
      this.logger.error(`Error connecting to database: ${error}`);
    });

    this.logger.log('Successfully connected to the database');
  }

  async onModuleDestroy() {
    await this.client.$disconnect().catch((error: Error) => {
      this.logger.error(`Error disconnecting from database: ${error}`);
    });

    this.logger.log('Successfully disconnected from the database');
  }
}
