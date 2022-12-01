import {
  Body,
  Controller,
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
  getAllChatrooms() {
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
    name: 'chatroomId',
    example: 1,
  })
  @ApiOperation({ summary: 'Get one chatroom / 특정 대화방 가져오기' })
  @Get(':chatroomId')
  async getOneChatroom(
    @User() user: IUser,
    @Param('chatroomId') chatroomId: number,
  ) {
    console.log('user.id', user.id);
    // console.log('getOneChatroom():', chatroomId);
    // console.log('getOneChatroom():', typeof chatroomId);
    return await this.chatroomService.getOneChatroom(chatroomId);
  }

  @ApiOperation({ summary: 'Update one chatroom / 특정 대화방 정보수정하기' })
  @Post(':chatroomId/update')
  updateChatroom() {}

  @ApiParam({
    name: 'chatroomId',
    example: 1,
  })
  @ApiOperation({
    summary:
      'Get all members from a chatroom / 특정 대화방의 모든 참여자목록 가져오기',
  })
  @Get(':chatroomId/members')
  getAllMembers(@Param('chatroomId') chatroomId: number) {
    return this.chatroomService.getAllMembers(chatroomId);
  }

  @ApiParam({
    name: 'chatroomId',
    example: 1,
  })
  @ApiOperation({
    summary:
      'Post members to a chatroom / 특정 대화방에 새로운 참여자 추가하기',
  })
  @Post(':chatroomId/members')
  postMembers(@User() user: IUser, @Param('chatroomId') chatroomId: number) {
    this.chatroomService.postMembers(user.id, chatroomId);
  }

  @ApiOperation({
    summary:
      'Get all contents for a chatroom / 특정 대화방의 모든 대화내용 가져오기',
  })
  @Get(':chatroomId/contents')
  getContents() {
    return this.chatroomService.getContents();
  }

  @ApiOperation({ summary: 'Post contents / 특정 대화방에 대화내용 입력하기' })
  @Post(':chatroomId/contents')
  postContents() {
    this.chatroomService.postContents();
  }
}
