import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';
import { AppConfigService } from 'src/appConfig/appConfig.service';
import { Response, Request } from 'express';
import { AuthConstants } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signIn(signInDto);

    if (result.authenticated) {
      const jwt = this.appConfigService.jwtConfig();

      response.cookie(AuthConstants.accessToken, result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: jwt.cookieAccessTokenAge * 60 * 1000,
        path: '/',
      });

      response.cookie(AuthConstants.refreshToken, result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: jwt.cookieRefreshTokenAge * 60 * 60 * 1000,
        path: '/api/auth/request-new-access-token',
      });

      return {
        authenticated: result.authenticated,
        user: result.user,
      };
    }

    return response.send('');
  }

  @Post('/request-new-access-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies[AuthConstants.refreshToken];
    const result = await this.authService.refreshToken(refreshToken);

    if (result.authenticated) {
      const jwt = this.appConfigService.jwtConfig();

      response.cookie(AuthConstants.accessToken, result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: jwt.cookieAccessTokenAge * 60 * 1000,
        path: '/',
      });

      response.cookie(AuthConstants.refreshToken, result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: jwt.cookieRefreshTokenAge * 60 * 60 * 1000,
        path: '/api/auth/request-new-access-token',
      });

      return {
        authenticated: result.authenticated,
        user: result.user,
      };
    }

    return response.send('');
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('RefershToken');
    return res.send('Logged out successfully');
  }
}
