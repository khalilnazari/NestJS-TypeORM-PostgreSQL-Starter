import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/auth.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/appConfig/appConfig.service';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    try {
      const isUserExist = await this.userRepository.findOneByEmail(email);
      if (!isUserExist) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      const passwordMatch = await bcrypt.compare(
        password,
        isUserExist.password,
      );
      if (!passwordMatch) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      const { password: _, ...user } = isUserExist;
      const accessToken = await this.getAccessToken(user);
      const refreshToken = await this.getRefreshToken(user);

      // Based on your security policy you can store the auth token in database and or catch it using tools like Redis

      this.logger.log(`User ${email} login at ${new Date()}`);

      return {
        accessToken,
        refreshToken,
        user,
        authenticated: true,
      };
    } catch (error) {
      if (error.code) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(
        `Failed to issue new AccessToken: ${JSON.stringify(error.message)}, ${JSON.stringify(error.stuck)}`,
      );
      throw new InternalServerErrorException(
        'Unable to sign in. Please try again later.',
      );
    }
  }

  async refreshToken(token: string) {
    const jwt = this.appConfigService.jwtConfig();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwt.jwtRefreshTokenSecret,
      });
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      // Depnding on your auth policy, if stored the auth token,
      // you can fetch and validate it from database or get it from catching tool like Redis

      const isUserValid = await this.userRepository.findOneByEmail(
        payload?.email,
      );
      if (!isUserValid) {
        throw new UnauthorizedException('Invalid token');
      }

      const { password: _, ...user } = isUserValid;
      const accessToken = await this.getAccessToken(user);
      const refreshToken = await this.getRefreshToken(user);

      this.logger.log(`User ${user.email} login at ${new Date()}`);

      return {
        accessToken,
        refreshToken,
        user,
        authenticated: true,
      };
    } catch (error) {
      if (error.code) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(
        `Failed to issue new AccessToken: ${JSON.stringify(error.message)}, ${JSON.stringify(error.stuck)}`,
      );
      throw new InternalServerErrorException(
        'Unable to authenticate. Please try again later.',
      );
    }
  }

  async getAccessToken(user) {
    const jwt = this.appConfigService.jwtConfig();
    return await this.jwtService.signAsync(user, {
      secret: jwt.jwtAccessTokenSecret,
      expiresIn: jwt.jwtAccessTokenExpiry,
    });
  }

  async getRefreshToken(user) {
    const jwt = this.appConfigService.jwtConfig();
    return await this.jwtService.signAsync(user, {
      secret: jwt.jwtRefreshTokenSecret,
      expiresIn: jwt.jwtRefreshTokenExpiry,
    });
  }
}
