import { AuthModule } from './auth';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users';
import { PostsModule} from "./posts"
// import { CronModule } from './cron';
// import { MeeterModule } from './meeter';
// import { MewsReservationModule } from './mews-reservation';
// import { MewsTravelAgencyModule } from './mews-travel-agency';
// import { PrismaModule } from './prisma';
// import { PrismaOldDbModule } from './prisma-old-db';
// import { RequestModule } from './request';
// import { ReservationModule } from './reservation';
// import { SpaceModule } from './space';
// import { TokenModule } from './token';

// import { UtilityBillingModule } from './utility-billing';

export const API_MODULES = [
  AuthModule,
  PrismaModule,
  UserModule,
  PostsModule
  // CronModule,
  // MeeterModule,
  // MewsReservationModule,
  // MewsTravelAgencyModule,
  // PrismaModule,
  // PrismaOldDbModule,
  // ReservationModule,
  // RequestModule,
  // SpaceModule,
  // TokenModule,
  // UserModule,
  // UtilityBillingModule,
];
