import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from 'src/users/services/user/user.interface';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/utils/decorators/user.decorator';
import { IUser } from 'src/typeorm/interfaces/IUser';

@ApiTags('USERS')
@Controller('users')
@UseGuards(JwtAccessAuthGuard)
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
  // @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getCurrentUser(@User() user: IUser) {
    // console.log('getCurrentUser()', user);
    const CurrentUser = await this.userService.getCurrentUser(user.id);
    if (!CurrentUser) {
      console.log('users/getCurrentUser() current user not found');
      throw new UnauthorizedException('user not found');
    }
    return CurrentUser;
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

  @ApiResponse({
    status: 200,
    description: 'success',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Get one user by id / id로 특정 사용자 정보요청' })
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    // console.log('getUserById()', id);
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    return user;
  }

  @ApiBody({
    type: Number,
    description: 'Target user id',
  })
  @ApiOperation({ summary: 'Block a user / 특정 사용자 차단하기' })
  @Patch('block')
  async blockUser(
    @User() user: IUser,
    @Body('targetUserId') targetUserId: number,
  ) {
    console.log('targetUserId:', targetUserId);
    return await this.userService.blockUser(user.id, targetUserId);
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
