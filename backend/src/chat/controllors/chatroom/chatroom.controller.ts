import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('CHATROOM')
@Controller('chatroom')
export class ChatroomController {
  @ApiOperation({ summary: 'get all chatrooms' })
  @Get()
  getAllChatrooms() {}

  @ApiOperation({ summary: 'create a chatroom' })
  @Post()
  createChatroom() {}

  @ApiOperation({ summary: 'get one chatroom' })
  @Get(':chatroom_id')
  getOneChatroom() {}

  @ApiOperation({ summary: 'get messages for a chatroom' })
  @Get(':chatroom_id/messages')
  getMessages() {}

  @ApiOperation({ summary: 'post messages' })
  @Post(':chatroom_id/messages')
  postMessage() {}

  @ApiOperation({ summary: 'get all members from a chatroom' })
  @Get(':chatroom_id/members')
  getAllMembers() {}

  @ApiOperation({ summary: 'post members to a chatroom' })
  @Post(':chatroom_id/members')
  postMembers() {}
}
