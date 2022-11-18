import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IUserService } from 'src/users/services/user/user.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService,
  ) {}
  @Get()
  async getCurrentUser() {
    // async getUsers() {
    const users = await this.userService.getCurrentUser();
    return users;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.userService.getUserById(id);
    return user;
  }

  @Patch(':id')
  updateUserById(@Param('id', ParseIntPipe) id: number) {
    this.userService.updateUserById(id);
  }
  // @Post()
  // createUser(@Body() user: UserDto) {
  //   return this.userService.createUser(user);
  // }

  // @Delete()
  // deleteUser() {}

}
