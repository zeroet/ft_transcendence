import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { IUserService } from 'src/users/services/user/user.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService,
  ) {}
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Delete()
  deleteUser() {}
}
