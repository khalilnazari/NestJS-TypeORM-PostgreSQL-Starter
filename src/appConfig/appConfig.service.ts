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
    return this.configService.get<boolean>(key);
  }

  public appPort() {
    return this.getNumber('PORT');
  }

  public dbConfig() {
    return {
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
    };
  }

  public emailConfig() {
    return {
      provider: this.getString('EMAIL_PROVIDER'),
    };
  }
}
