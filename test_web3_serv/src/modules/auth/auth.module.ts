import { Module, InternalServerErrorException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { requiredEnvs } from '../../required-envs';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Перевірка всіх обов'язкових env
        requiredEnvs.forEach((key) => {
          if (!configService.get<string>(key)) {
            throw new InternalServerErrorException(
              `Environment variable ${key} is required but not set`,
            );
          }
        });

        // JWT Secret
        const jwtSecret = configService.get<string>('REACT_APP_JWT_SECRET_KEY');
        if (!jwtSecret) {
          throw new InternalServerErrorException(
            'Environment variable REACT_APP_JWT_SECRET_KEY is required but not set',
          );
        }

        // JWT Access Expiration
        const expirationStr = configService.get<string>('REACT_APP_JWT_ACCESS_EXP');
        if (!expirationStr) {
          throw new InternalServerErrorException(
            'Environment variable REACT_APP_JWT_ACCESS_EXP is required but not set',
          );
        }

        const expirationMs = ms(expirationStr as ms.StringValue);
        if (expirationMs === undefined) {
          throw new InternalServerErrorException(
            `Invalid JWT expiration value: ${expirationStr}`,
          );
        }

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: expirationMs },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
