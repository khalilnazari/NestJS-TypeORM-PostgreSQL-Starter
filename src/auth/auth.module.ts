import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/user.repository';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/appConfig/appConfig.module';

@Module({
  imports: [UserModule, JwtModule, AppConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
