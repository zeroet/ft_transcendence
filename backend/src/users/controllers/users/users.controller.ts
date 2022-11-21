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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from 'src/users/services/user/user.interface';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: IUserService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'success',
    type: UserDto,
  })
  @ApiOperation({ summary: 'get current user' })
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getCurrentUser(@Request() req) {
    const user = await this.userService.getCurrentUser(req.user.id);
    if (!user) throw new UnauthorizedException('user not found');
    return user;
  }

  @ApiResponse({
    status: 200,
    description: 'success',
    type: UserDto,
  })
  @ApiOperation({ summary: 'get one user by id' })
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.userService.getUserById(id);
    if (!user) throw new UnauthorizedException('user not found');
    return user;
  }

  // @Patch(':id')
  // updateUserById(@Param('id', ParseIntPipe) id: number) {
  //   this.userService.updateUserById(id);
  // }
  // @Post()
  // createUser(@Body() user: UserDto) {
  //   return this.userService.createUser(user);
  // }

  // @Delete()
  // deleteUser() {}
}
