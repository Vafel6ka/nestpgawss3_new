import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { requiredEnvs } from '../../required-envs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Перевіряємо, чи всі потрібні env змінні встановлені
    requiredEnvs.forEach((key) => {
      if (!configService.get<string>(key)) {
        throw new Error(`Environment variable ${key} is required but not set`);
      }
    });

    const secret = configService.get<string>('REACT_APP_JWT_SECRET_KEY'); 
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret!, // TypeScript знає, що вже перевірено
    });
  }

  async validate(payload: any) {
    return { address: payload.address };
  }
}
