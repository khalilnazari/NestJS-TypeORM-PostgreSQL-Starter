import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto, UserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  private async hashPassword(text: string) {
    // This is the simpalist way of password hasshing
    // You can use build-in Nodejs crypto and argon2 library for better secrurity based on your password policy and requirements
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(text, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto | null> {
    const { email, password } = createUserDto;
    try {
      const isUserExist = await this.userRepository.findOneByEmail(email);
      if (isUserExist) {
        throw new ConflictException('User exist with email: ' + email);
      }

      createUserDto.password = await this.hashPassword(password);
      const user = await this.userRepository.create(createUserDto);
      if (!user) {
        this.logger.debug(`Failed to create user: ${email}`);
        return null;
      }

      this.logger.log(`Created user: ${email}`);
      return new UserResponseDto(user);
    } catch (error) {
      if (error.code) {
        throw new ConflictException(`User with email ${email} already exists.`);
      }

      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unable to create user. Please try again later.',
      );
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
