import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.repository.create(createUserDto);
    return await this.repository.save(user);
  }

  async findOneByEmail(email: string) {
    return await this.repository.findOneBy({ email });
  }
}
