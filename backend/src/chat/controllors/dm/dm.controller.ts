import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.access-auth.guard';
import { IDmService } from 'src/chat/services/dm/dm.interface';
import { IUser } from 'src/typeorm/interfaces/IUser';
import { User } from 'src/utils/decorators/user.decorator';

@ApiTags('DM')
@Controller('dm')
@UseGuards(JwtAccessAuthGuard)
export class DmController {
  constructor(@Inject('DM_SERVICE') private dmSerivce: IDmService) {}

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Receiver id',
  })
  @ApiOperation({ summary: 'create a new dm / 디엠 추가하기' })
  @Post(':receiverId')
  async createDm(@User() user: IUser, @Param('receiverId') receiverId: number) {
    return await this.dmSerivce.createDm(user.id, receiverId);
  }

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Dm id',
  })
  @ApiOperation({
    summary: 'Get members for a DM / 특정 디엠의 참여자 가져오기',
  })
  @Get(':receiverId/members')
  async getMembers(
    @User() user: IUser,
    @Param('receiverId') receiverId: number,
  ) {
    return await this.dmSerivce.getMembers(user.id, receiverId);
  }

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Dm id',
  })
  @ApiOperation({
    summary: 'Get contents for a DM / 특정 디엠의 대화내용 가져오기',
  })
  @Get(':receiverId/contents')
  async getContents(
    @User() user: IUser,
    @Param('receiverId') receiverId: number,
  ) {
    return await this.dmSerivce.getContents(user.id, receiverId);
  }

  @ApiBody({
    type: String,
    description: 'Content that a user entered',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Dm id',
  })
  @ApiOperation({ summary: 'post contents / 특정 디엠에 대화내용 입력하기' })
  @Post(':receiverId/contents')
  async postContents(
    @User() user: IUser,
    @Param('receiverId') receiverId: number,
    @Body('content') content: string,
  ) {
    return await this.dmSerivce.postContents(user.id, receiverId, content);
  }
}
