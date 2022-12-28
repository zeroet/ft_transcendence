import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
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
import { ChangeOwnerDto } from 'src/chat/dto/change-owner.dto';
import { ChatContentDto } from 'src/chat/dto/chat.content.dto';
import { ChatMemberDto } from 'src/chat/dto/chat.member.dto';
import { ChatroomDto } from 'src/chat/dto/chatroom.dto';
import { CreateChatroomDto } from 'src/chat/dto/create-chatroom.dto';
import { SetAdminDto } from 'src/chat/dto/set-admin.dto';
import { UpdateChatroomDto } from 'src/chat/dto/update-chatroom.dto';
import { UpdateMemberDto } from 'src/chat/dto/update-member.dto';
import { UpdateParticipantDto } from 'src/chat/dto/update-participant.dto';
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
  async getChatrooms() {
    return this.chatroomService.getChatrooms();
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
    return this.chatroomService.createChatroom(user.id, createChatroomDto);
  }

  @ApiResponse({
    type: ChatroomDto,
    description: 'A chatroom info',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({ summary: 'Get one chatroom / 특정 대화방 가져오기' })
  @Get(':id')
  async getOneChatroom(@User() user: IUser, @Param('id') id: number) {
    return await this.chatroomService.getOneChatroom(id);
  }

  @ApiResponse({
    type: Boolean,
    description: 'Password validation',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiBody({
    type: String,
    description: 'password that a user entered',
  })
  @ApiOperation({ summary: 'Verify chatroom password / 대화방 비밀번호 확인' })
  @Post(':id/password')
  async verifyChatroomPassword(
    @Param('id') id: number,
    @Body('password') password: string,
  ) {
    return await this.chatroomService.verifyChatroomPassword(id, password);
  }

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({ summary: 'Delete a chatroom / 특정 대화방 삭제하기' })
  @Delete(':id')
  async deleteChatroom(@User() user: IUser, @Param('id') id: number) {
    return this.chatroomService.deleteChatroom(user.id, id);
  }

  @ApiBody({
    type: UpdateChatroomDto,
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({ summary: 'Update one chatroom / 특정 대화방 정보수정하기' })
  @Patch(':id/update')
  updateChatroom(
    @User() user: IUser,
    @Param('id') id: number,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ) {
    console.log('chatroomId:', id);
    console.log('updateChatroomDto:', updateChatroomDto);
    return this.chatroomService.updateChatroomInfo(
      user.id,
      id,
      updateChatroomDto,
    );
  }

  @ApiBody({
    type: ChangeOwnerDto,
    description: 'Target user id',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary: 'Change owner of a chatroom / 특정 대화방 주인 변경하기',
  })
  @Patch(':id/owner')
  async changeOwner(
    @User() user: IUser,
    @Param('id') id: number,
    @Body('targetUserId') targetUserId: number,
  ) {
    return this.chatroomService.changeOwner(user.id, id, targetUserId);
  }

  @ApiBody({
    type: SetAdminDto,
    description:
      'Target user id and true or false to set the target user as admin',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary: 'Set admin of a chatroom / 특정 대화방 방장권한 부여하기',
  })
  @Patch(':id/admin')
  async setAdmin(
    @User() user: IUser,
    @Param('id') id: number,
    @Body() setAdminDto: SetAdminDto,
  ) {
    return this.chatroomService.setAdmin(
      user.id,
      id,
      setAdminDto.targetUserId,
      setAdminDto.isAdmin,
    );
  }

  @ApiResponse({
    type: ChatMemberDto,
    description: 'Participant list of a chatroom',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Get all participants from a chatroom / 특정 대화방의 모든 참여자목록 가져오기',
  })
  @Get(':id/participants')
  async getParticipants(@Param('id') id: number) {
    return this.chatroomService.getParticipants(id);
  }

  @ApiBody({
    type: UpdateParticipantDto,
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Update participants of a chatroom / 특정 대화방의 참여자 정보 수정하기',
  })
  @Patch(':id/participants/update')
  async updateParticipantsInfo(
    @User() user: IUser,
    @Param('id') id: number,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return await this.chatroomService.updateParticipantInfo(
      user.id,
      id,
      updateParticipantDto,
    );
  }

  @ApiResponse({
    type: ChatMemberDto,
    description: 'Participant list of a chatroom',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Delete participants to a chatroom / 특정 대화방에 참여자 삭제하기',
  })
  @Delete(':id/participants')
  deleteParticipants(@User() user: IUser, @Param('id') id: number) {
    return this.chatroomService.deleteParticipants(user.id, id);
  }

  @ApiResponse({
    type: ChatMemberDto,
    description: 'Member list of a chatroom',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Get all members from a chatroom / 특정 대화방의 모든 현재 참여자목록 가져오기',
  })
  @Get(':id/members')
  async getMembers(@Param('id') id: number) {
    return this.chatroomService.getMembers(id);
  }

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Post members to a chatroom / 특정 대화방에 새로운 현재 참여자 추가하기',
  })
  @Post(':id/members')
  async postMembers(@User() user: IUser, @Param('id') id: number) {
    return await this.chatroomService.postMembers(user.id, id);
  }

  @ApiBody({
    type: UpdateMemberDto,
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Update members of a chatroom / 특정 대화방의 현재 참여자 정보 수정하기',
  })
  @Patch(':id/members/update')
  async updateMembersInfo(
    @User() user: IUser,
    @Param('id') id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.chatroomService.updateMemberInfo(
      user.id,
      id,
      updateMemberDto,
    );
  }

  @ApiResponse({
    type: ChatMemberDto,
    description: 'Member list of a chatroom',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Delete members to a chatroom / 특정 대화방에 현재 참여자 삭제하기',
  })
  @Delete(':id/members')
  deleteMembers(@User() user: IUser, @Param('id') id: number) {
    return this.chatroomService.deleteMembers(user.id, id);
  }

  @ApiResponse({
    type: ChatContentDto,
    isArray: true,
    description: 'Contents of a chatroom',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({
    summary:
      'Get all contents for a chatroom / 특정 대화방의 모든 대화내용 가져오기',
  })
  @Get(':id/contents')
  async getContents(@User() user: IUser, @Param('id') id: number) {
    return await this.chatroomService.getContents(user.id, id);
  }

  @ApiResponse({
    type: ChatMemberDto,
  })
  @ApiBody({
    type: String,
    description: 'Content that a user entered',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Chatroom id',
  })
  @ApiOperation({ summary: 'Post contents / 특정 대화방에 대화내용 입력하기' })
  @Post(':id/contents')
  async postContents(
    @User() user: IUser,
    @Param('id') id: number,
    @Body('content') content: string,
  ) {
    return await this.chatroomService.postContents(user.id, id, content);
  }
}
