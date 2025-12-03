import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { requiredEnvs } from './required-envs';
import * as dotenv from 'dotenv';
import { AppConfigProvider } from './common/config/providers';
import { execSync } from 'node:child_process';

dotenv.config();

console.log("process.env.PORT", process.env.REACT_APP_LISTEN_PORT)
//Advantage: This integrates cleanly with NestJS and makes environment variables accessible anywhere via DI.
async function ensureMigrations() {
  try {
    const output = execSync("npx prisma migrate status --json").toString();
    const status = JSON.parse(output);

    if (status.databaseIsBehind) {
      console.log("📌 Prisma: new migrations found → applying...");
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
      console.log("✅ Prisma migrations applied");
    } else {
      console.log("👌 Prisma: no pending migrations");
    }
  } catch (err) {
    console.error("❌ Failed to check/apply Prisma migrations:", err);
  }
}

async function bootstrap() {
  await ensureMigrations(); // <<–––––––––––– ADD THIS
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigProvider);
  appConfig.isEnvSetOrThrow(requiredEnvs); //check the all ens variables

  const port = appConfig.port;
  app.enableCors(appConfig.corsSettings);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
