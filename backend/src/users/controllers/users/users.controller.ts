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
  Request,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from 'src/users/services/user/user.interface';
import {JwtAccessAuthGuard} from 'src/auth/guards/jwt.access-auth.guard'

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService,
  ) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getCurrentUser(@Request() req) {
    const users = await this.userService.getCurrentUser(req.user.id);
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
