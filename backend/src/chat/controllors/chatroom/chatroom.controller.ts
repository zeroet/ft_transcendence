import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { ChatMemberDto } from 'src/chat/dto/chat.member.dto';
import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { IChatroomService } from 'src/chat/services/chatroom/chatroom.interface';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { User } from 'src/utils/decorators/user.decorator';

@ApiTags('CHATROOM')
@Controller('chatroom')
@UseGuards(JwtAccessAuthGuard)
export class ChatroomController {
  constructor(
    @Inject('CHATROOM_SERVICE') private chatroomService: IChatroomService,
  ) {}

  @ApiOkResponse({
    type: ChatroomDto,
    isArray: true,
    description: 'Every chatroom info',
  })
  @ApiOperation({ summary: 'Get all chatrooms / 모든 대화방 가져오기' })
  @Get()
  async getAllChatrooms() {
    return this.chatroomService.getAllChatrooms();
  }

  @ApiResponse({
    status: 201,
    type: ChatroomDto,
    description: 'Created chatroom info',
  })
  @ApiBody({
    required: true,
    type: CreateChatroomDto,
  })
  @ApiOperation({ summary: 'Create a chatroom / 대화방 생성하기' })
  @Post()
  async createChatroom(
    @User() user: IUser,
    @Body() createChatroomDto: CreateChatroomDto,
  ) {
    // console.log('createChatroom()');
    // console.log('user:', user);
    // console.log('dto:', createChatroomDto);
    return this.chatroomService.createChatroom(user.id, createChatroomDto);
  }

  @ApiResponse({
    type: ChatroomDto,
    description: 'A chatroom info',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOperation({ summary: 'Get one chatroom / 특정 대화방 가져오기' })
  @Get(':id')
  async getOneChatroom(@User() user: IUser, @Param('id') id: number) {
    console.log('user.id', user.id);
    console.log('getOneChatroom():', id);
    console.log('getOneChatroom():', typeof id);
    return await this.chatroomService.getOneChatroom(id);
  }

  @ApiResponse({
    type: Boolean,
    description: 'password validation',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: String,
    description: 'password that a user entered',
  })
  @ApiOperation({ summary: 'verify chatroom password / 대화방 비밀번호 확인' })
  @Post(':id/password')
  async verifyChatroomPassword(
    @Param('id') id: number,
    @Body('password') password: string,
  ) {
    return await this.chatroomService.verifyChatroomPassword(id, password);
  }

  // @ApiOperation({ summary: 'Update one chatroom / 특정 대화방 정보수정하기' })
  // @Post(':chatroomId/update')
  // updateChatroom() {}

  @ApiResponse({
    type: ChatMemberDto,
    description: 'Member list of a chatroom',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOperation({
    summary:
      'Get all members from a chatroom / 특정 대화방의 모든 참여자목록 가져오기',
  })
  @Get(':id/members')
  async getAllMembers(@Param('id') id: number) {
    return this.chatroomService.getAllMembers(id);
  }

  // @ApiResponse({
  //   type: ChatMemberDto,
  //   description: 'Member list of a chatroom',
  // })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOperation({
    summary:
      'Post members to a chatroom / 특정 대화방에 새로운 참여자 추가하기',
  })
  @Post(':id/members')
  postMembers(@User() user: IUser, @Param('id') id: number) {
    return this.chatroomService.postMembers(user.id, id);
  }

  @ApiResponse({
    type: ChatMemberDto,
    description: 'Member list of a chatroom',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOperation({
    summary: 'Delete members to a chatroom / 특정 대화방에 참여자 삭제하기',
  })
  @Delete(':id/members')
  deleteMembers(@User() user: IUser, @Param('id') id: number) {
    return this.chatroomService.deleteMembers(user.id, id);
  }

  @ApiOperation({
    summary:
      'Get all contents for a chatroom / 특정 대화방의 모든 대화내용 가져오기',
  })
  @Get(':id/contents')
  getContents() {
    return this.chatroomService.getContents();
  }

  @ApiOperation({ summary: 'Post contents / 특정 대화방에 대화내용 입력하기' })
  @Post(':id/contents')
  postContents() {
    this.chatroomService.postContents();
  }
}
