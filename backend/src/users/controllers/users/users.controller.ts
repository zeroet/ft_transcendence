import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from 'src/users/services/user/user.interface';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/utils/decorators/user.decorator';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { Status } from 'src/utils/types';
import { UpdateUserStatusDto } from 'src/users/dto/update-user.status.dto';

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
  @Get()
  async getCurrentUser(@User() user: IUser) {
    const CurrentUser = await this.userService.getCurrentUser(user.id);
    if (!CurrentUser) {
      throw new UnauthorizedException('User not found');
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
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @ApiParam({
    name: 'Block user id',
    example: 12,
  })
  @ApiOperation({ summary: 'Block a user by id / id로 특정 사용자 차단하기' })
  @Post('block/:blockUserId')
  async blockUser(
    @User() user: IUser,
    @Param('blockUserId') blockUserId: number,
  ) {
    return await this.userService.blockUser(user.id, blockUserId);
  }

  @ApiParam({
    name: 'Unblock user id',
    example: 12,
  })
  @ApiOperation({
    summary: 'unBlock a user by id / id로 특정 사용자 차단 해제하기',
  })
  @Delete('block/:unBlockUserId')
  async unBlockUser(
    @User() user: IUser,
    @Param('unBlockUserId') unBlockUserId: number,
  ) {
    return await this.userService.unBlockUser(user.id, unBlockUserId);
  }

  @ApiOperation({
    summary: 'Get block list by user id / 사용자 id로 차단목록 가져오기',
  })
  @Get('block/list')
  async getBlockList(@User() user: IUser) {
    return await this.userService.getBlockList(user.id);
  }

  @ApiParam({
    name: 'Friend user id',
    example: 12,
  })
  @ApiOperation({
    summary: 'Add a user as a friend by id / id로 특정 사용자 친구 추가하기',
  })
  @Post('friend/:friendUserId')
  async addFriend(
    @User() user: IUser,
    @Param('friendUserId') friendUserId: number,
  ) {
    return await this.userService.addFriend(user.id, friendUserId);
  }

  @ApiParam({
    name: 'Unfriend user id',
    example: 12,
  })
  @ApiOperation({
    summary:
      'Delete a user from friends list by id / id로 특정 사용자 친구 삭제하기',
  })
  @Delete('friend/:unFriendUserId')
  async deleteFriend(
    @User() user: IUser,
    @Param('unFriendUserId') unFriendUserId: number,
  ) {
    return await this.userService.deleteFriend(user.id, unFriendUserId);
  }

  @ApiOperation({
    summary: 'Get friend list by user id / 사용자 id로 친구목록 가져오기',
  })
  @Get('friend/list')
  async getFriendList(@User() user: IUser) {
    return await this.userService.getFriendList(user.id);
  }

  @ApiBody({
    type: UpdateUserStatusDto,
    description:
      'User status: "LOGIN" or "LOGOUT" or "PLAYING" or "WATCHING" or "READY"',
  })
  @ApiOperation({
    summary: 'Update user status / 사용자 상태 변경하기',
  })
  @Post('status')
  async updateUserStatus(@User() user: IUser, @Body('status') status: Status) {
    return await this.userService.updateUserStatus(user.id, status);
  }

  @Get('match/:id')
  async match(@Param('id') id: number) {
    return await this.userService.getMatch(id);
  }

  @Get('rank/:id')
  async rank(@Param('id') id: number) {
    let matchs = await this.userService.getMatch(id);
    let num = 0;
    for (const match of matchs) num++;
    return num;
  }
}
