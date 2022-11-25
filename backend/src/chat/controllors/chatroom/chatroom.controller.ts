import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IChatroomService } from 'src/chat/services/chatromm/chatroom.interface';

@ApiTags('CHATROOM')
@Controller('chatroom')
export class ChatroomController {
  constructor(
    @Inject('CHATROOM_SERVICE') private chatroomService: IChatroomService,
  ) {}
  @ApiOperation({ summary: 'Get all chatrooms / 모든 대화방 가져오기' })
  @Get()
  getAllChatrooms() {}

  @ApiOperation({ summary: 'Create a chatroom / 대화방 생성하기' })
  @Post()
  createChatroom() {}

  @ApiOperation({ summary: 'Get one chatroom / 특정 대화방 가져오기' })
  @Get(':chatroom_id')
  getOneChatroom() {}

  @ApiOperation({
    summary:
      'Get all contents for a chatroom / 특정 대화방의 모든 대화내용 가져오기',
  })
  @Get(':chatroom_id/contents')
  getMessages() {}

  @ApiOperation({ summary: 'Post contents / 특정 대화방에 대화내용 입력하기' })
  @Post(':chatroom_id/contents')
  postMessage() {}

  @ApiOperation({
    summary:
      'Get all members from a chatroom / 특정 대화방의 모든 참여자목록 가져오기',
  })
  @Get(':chatroom_id/members')
  getAllMembers() {}

  @ApiOperation({
    summary:
      'Post members to a chatroom / 특정 대화방에 새로운 참여자 추가하기',
  })
  @Post(':chatroom_id/members')
  postMembers() {}
}
