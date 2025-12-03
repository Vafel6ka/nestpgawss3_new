import { Injectable, Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

// import { ValidationPipeConfigProvider } from './validation-pipe.config.provider';

@Injectable()
export class AppConfigProvider {
  private readonly logger = new Logger(AppConfigProvider.name);

  constructor(
    private readonly configService: ConfigService,
    // private readonly validationPipeConfigProvider: ValidationPipeConfigProvider
  ) {}

  get port(): number {
    return parseInt(this.configService.get<string>('REACT_APP_LISTEN_PORT', '4000'));
  }

  get logLevel(): LogLevel {
    const validLogLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'];
    const logLevel = this.configService.get<LogLevel>('APP_LOG_LEVEL', 'verbose');

    if (!validLogLevels.includes(logLevel)) {
      this.logger.warn(
        `Invalid APP_LOG_LEVEL: ${logLevel}. Would default to 'verbose'. Valid values are: ${validLogLevels.join(', ')}`
      );

      return 'verbose';
    }

    return logLevel;
  }

  get corsOrigins(): string[] {
    const domains = this.configService.get<string>('REACT_APP_CORS_ORIGINS', '*').split(',');

    return domains.includes('*') ? ['*'] : domains;
  }

  get corsMethods(): string {
    return this.configService.get<string>('REACT_APP_CORS_METHODS', 'not_set');
  }

  get corsHeaders(): string {
    return this.configService.get<string>('REACT_APP_CORS_HEADERS', 'not_set');
  }

  get corsCredentials(): boolean {
    return Boolean(this.configService.get<boolean>('REACT_APP_CORS_CREDENTIALS', true));
  }

  get corsMaxAge(): number {
    return parseInt(this.configService.get<string>('REACT_APP_CORS_MAX_AGE', '3600'));
  }

  // get validationPipe(): ValidationPipe {
  //   return this.validationPipeConfigProvider.validationPipeConfig;
  // }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'debug');
  }

  get corsSettings(): CorsOptions {
    return {
      origin: this.corsOrigins.includes('*') ? true : this.corsOrigins,
      methods: this.corsMethods !== 'not_set' ? this.corsMethods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: this.corsHeaders !== 'not_set' ? this.corsHeaders : 'Content-Type,Authorization',
      credentials: this.corsCredentials,
      maxAge: this.corsMaxAge,
    };
  }
  

  isEnvSetOrThrow = (requiredEnvVars: string[]) => {
    const missingEnvs: string[] = [];

    requiredEnvVars.forEach((envVar) => {
      if (!this.configService.get<string>(envVar)) {
        missingEnvs.push(envVar);
      }
    });

    if (missingEnvs.length) {
      throw new Error(`Missing required environment variable(s): ${missingEnvs.join(', ')}`);
    }
  };
}
