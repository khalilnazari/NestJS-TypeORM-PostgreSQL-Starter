import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppConfigService } from 'src/appConfig/appConfig.service';
import { AuthConstants } from './auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(
    private appConfigService: AppConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies[AuthConstants.accessToken];

    if (!token) {
      throw new UnauthorizedException();
    }

    const jwt = this.appConfigService.jwtConfig();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwt.jwtAccessTokenSecret,
      });
      request['userContext'] = payload;

      // Depnding on your auth policy, if stored the auth token,
      // you can fetch and validate it from database or get it from catching tool like Redis

      const scopes =
        this.reflector.get<string[]>('scopes', context.getHandler()) || [];

      if (!scopes.includes(payload.role)) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      if (error.code) {
        throw new UnauthorizedException(`Failed to login the user.`);
      }

      this.logger.error(
        `Failed to login the user: ${error.message}`,
        error.stack,
      );
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unable to authenticate the user. Please try again later.',
      );
    }

    return true;
  }
}
