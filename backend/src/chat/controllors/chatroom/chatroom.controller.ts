import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('CHATROOM')
@Controller('chatroom')
export class ChatroomController {
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
      'Get all messages for a chatroom / 특정 대화방의 모든 대화내용 가져오기',
  })
  @Get(':chatroom_id/messages')
  getMessages() {}

  @ApiOperation({ summary: 'Post messages / 특정 대화방에 대화내용 입력하기' })
  @Post(':chatroom_id/messages')
  postMessage() {}

  @ApiOperation({
    summary:
      'Get all members from a chatroom / 특정 대화방의 모든 참여자내역 가져오기',
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
