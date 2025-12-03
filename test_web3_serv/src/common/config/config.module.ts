import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { CONFIG_EXPORTS, CONFIG_PROVIDERS } from './index';

@Global()
@Module({
  imports: [NestConfigModule.forRoot()],
  providers: [...CONFIG_PROVIDERS],
  exports: [...CONFIG_EXPORTS],
})
export class ConfigModule {}