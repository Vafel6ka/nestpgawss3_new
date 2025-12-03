import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { API_MODULES } from './modules/index.js';
import { COMMON_MODULES } from './common/index.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
// import { PrismaService } from './prisma/prisma.service';
// import { UserService } from './user/user.service';
// import { PrismaModule } from './modules/prisma/prisma.module';
// import { UserModule } from './modules/user/user.module';
// import { PostModule } from './modules/posts/posts.module.js';
// import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Доступ до env у всіх модулях без повторного імпорту
      envFilePath: ['../.env'], // або ['../.env'], якщо файл вище по дереву
    }),
    ...API_MODULES, ...COMMON_MODULES,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
