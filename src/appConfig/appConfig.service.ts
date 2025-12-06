import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  private getNumber(key: string) {
    return this.configService.get<number>(key);
  }

  private getString(key: string) {
    return this.configService.get<string>(key);
  }

  private getBoolean(key: string) {
    return this.configService.get<string>(key) === 'true' ? true : false;
  }

  public appPort() {
    return this.getNumber('PORT');
  }

  public dbConfig() {
    return {
      host: this.getString('POSTGRES_HOST'),
      port: this.getNumber('POSTGRES_PORT'),
      username: this.getString('POSTGRES_USERNAME'),
      password: this.getString('POSTGRES_PASSWORD'),
      database: this.getString('POSTGRES_DATABASE'),
      synchronize: this.getBoolean('POSTGRES_SYNCHRONIZE'),
      logging: this.getBoolean('POSTGRES_LOGGING'),
      ssl: this.getBoolean('POSTGRES_SSL'),
      connectTimeoutMS: this.getNumber('POSTGRES_POOL_CONNECT_TIMEOUT'),
      poolSize: this.getNumber('POSTGRES_POOL_MAX'),
      extra: {
        idleTimeoutMillis: this.getNumber('POSTGRES_POOL_IDLE_TIMEOUT'),
      },
    };
  }

  public emailConfig() {
    return {
      provider: this.getString('EMAIL_PROVIDER'),
    };
  }

  public jwtConfig() {
    return {
      jwtAccessTokenSecret: this.getString('JWT_ACCESS_TOKEN_SECRET')!,
      jwtAccessTokenExpiry: this.getNumber('JWT_ACCESS_TOKEN_EXPIRY')!,
      jwtRefreshTokenSecret: this.getString('JWT_REFRESH_TOKEN_SECRET')!,
      jwtRefreshTokenExpiry: this.getNumber('JWT_REFRESH_TOKEN_EXPIRY')!,
      cookieAccessTokenAge: this.getNumber('COOKIE_ACCESS_TOKEN_AGE')!,
      cookieRefreshTokenAge: this.getNumber('COOKIE_REFRESH_TOKEN_AGE')!,
    };
  }
}
