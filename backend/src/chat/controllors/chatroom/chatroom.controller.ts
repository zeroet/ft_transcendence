import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { IChatroomService } from 'src/chat/services/chatromm/chatroom.interface';
import { User } from 'src/utils/decorators/user.decorator';

@ApiTags('CHATROOM')
@Controller('chatroom')
@UseGuards(JwtAccessAuthGuard)
export class ChatroomController {
  constructor(
    @Inject('CHATROOM_SERVICE') private chatroomService: IChatroomService,
  ) {}
  @ApiOperation({ summary: 'Get all chatrooms / 모든 대화방 가져오기' })
  @Get()
  getAllChatrooms() {
    return this.chatroomService.getAllChatrooms();
  }

  @ApiBody({
    required: true,
    type: CreateChatroomDto,
  })
  @ApiOperation({ summary: 'Create a chatroom / 대화방 생성하기' })
  @Post()
  async createChatroom(
    @User() user,
    @Body() createChatroomDto: CreateChatroomDto,
  ) {
    // console.log('createChatroom()');
    // console.log('user:', user);
    // console.log('dto:', createChatroomDto);
    return this.chatroomService.createChatroom(user.id, createChatroomDto);
  }

  @ApiOperation({ summary: 'Get one chatroom / 특정 대화방 가져오기' })
  @Get(':chatroomId')
  getOneChatroom() {}

  @ApiOperation({ summary: 'Update one chatroom / 특정 대화방 정보수정하기' })
  @Post(':chatroomId/update')
  updateChatroom() {}

  @ApiOperation({
    summary:
      'Get all contents for a chatroom / 특정 대화방의 모든 대화내용 가져오기',
  })
  @Get(':chatroomId/contents')
  getMessages() {}

  @ApiOperation({ summary: 'Post contents / 특정 대화방에 대화내용 입력하기' })
  @Post(':chatroomId/contents')
  postMessages() {}

  @ApiOperation({
    summary:
      'Get all members from a chatroom / 특정 대화방의 모든 참여자목록 가져오기',
  })
  @Get(':chatroomId/members')
  getAllMembers(@Body() chatroomId: number) {}

  @ApiOperation({
    summary:
      'Post members to a chatroom / 특정 대화방에 새로운 참여자 추가하기',
  })
  @Post(':chatroomId/members')
  postMembers(@Body() chatroomId: number) {}
}
