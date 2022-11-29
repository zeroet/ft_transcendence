import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
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
import { User } from 'src/utils/decorators/user.decorator';

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
  @ApiOperation({
    summary: 'Get current user / 현재 로그인된 사용자 정보요청',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getCurrentUser(@User() user) {
    console.log('getCurrentUser()', user);
    const CurrentUser = await this.userService.getCurrentUser(user.id);
    if (!CurrentUser) {
      console.log('users/getCurrentUser() current user not found');
      throw new UnauthorizedException('user not found');
    }
    return CurrentUser;
  }

  @ApiResponse({
    status: 200,
    description: 'success',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Get one user by id / id로 특정 사용자 정보요청' })
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    console.log('getUserById()', id);
    const user = await this.userService.getUserById(id);
    if (!user) throw new UnauthorizedException('user not found');
    return user;
  }

  @ApiOperation({
    summary: 'Get all users / 로그인된 모든 사용자 정보요청',
  })
  @Get('all')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    if (!users) {
      throw new NotFoundException('No existing users found');
    }
    return users;
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
