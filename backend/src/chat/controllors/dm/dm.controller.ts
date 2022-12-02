import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IDmService } from 'src/chat/services/dm/dm.interface';

@ApiTags('DM')
@Controller('dm')
export class DmController {
  constructor(@Inject('DM_SERVICE') private dmSerivce: IDmService) {}
  @ApiOperation({
    summary: 'Get members for a DM / 특정 디엠의 참여자 가져오기',
  })
  @Get(':id/contents')
  getMembers() {}

  @ApiOperation({ summary: 'post members / 특정 디엠에 참여자 추가하기' })
  @Post(':id/contents')
  postMembers() {}
  @ApiOperation({
    summary: 'Get contents for a DM / 특정 디엠의 대화내용 가져오기',
  })
  @Get(':id/contents')
  getContents() {}

  @ApiOperation({ summary: 'post contents / 특정 디엠에 대화내용 입력하기' })
  @Post(':id/contents')
  postContents() {}
}
