import { Module } from '@nestjs/common';
import { AppConfigService } from './appConfig.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
