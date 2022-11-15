import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
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

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }
  // @Post()
  // createUser(@Body() user: UserDto) {
  //   return this.userService.createUser(user);
  // }

  // @Delete()
  // deleteUser() {}
}
