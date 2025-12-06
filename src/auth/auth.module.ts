import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/appConfig/appConfig.module';

@Module({
  imports: [UserModule, JwtModule.register({ global: true }), AppConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
