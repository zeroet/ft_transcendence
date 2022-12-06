import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
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

  @ApiOperation({ summary: 'Get all dm list / 디엠 목록가져오기' })
  @Get('')
  async getDmList(@User() user: IUser) {
    return await this.dmSerivce.getDmList(user.id, 0);
  }

  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Receiver id',
  })
  @ApiOperation({ summary: 'Create a new dm / 디엠 추가하기' })
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
  @ApiOperation({ summary: 'Post contents / 특정 디엠에 대화내용 입력하기' })
  @Post(':receiverId/contents')
  async postContents(
    @User() user: IUser,
    @Param('receiverId') receiverId: number,
    @Body('content') content: string,
  ) {
    return await this.dmSerivce.postContents(user.id, receiverId, content);
  }

  //  @ApiOperation({
  //     summary: '안읽은 DM 개수 구하기',
  //     description:
  //       'after시간 이후로 해당 사용자로부터 새로 받은 DM의 개수\n\n' +
  //       'after은 1970년 1월 1일 00:00:00 UTC 이후 경과 시간 (밀리 초)을 나타내는 숫자로 ' +
  //       'Date객체에서 getTime()함수로 구한 값입니다.',
  //   })
  //   @ApiOkResponse({
  //     type: String,
  //     description: '',
  //   })
  //   @ApiBadRequestResponse({
  //     description: '.',
  //   })
  @Get(':senderId/unreads')
  async getUnreads(
    @User() user: IUser,
    @Param('senderId') senderId: number,
    @Query('after') after: number,
  ) {
    return await this.dmSerivce.getUnreads(user.id, senderId, after);
  }
}
