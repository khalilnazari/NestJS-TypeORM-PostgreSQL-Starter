import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/auth.decorator';
import { AccessScope } from 'src/auth/auth.roles';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Auth(AccessScope.admin)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Auth(AccessScope.user)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const authenticated = req['userContext']; // access to authenticated user data

    return this.userService.findOne(+id);
  }

  @Auth(AccessScope.user)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Auth(AccessScope.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
