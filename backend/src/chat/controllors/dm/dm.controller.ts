import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('dm')
export class DmController {
  @ApiOperation({
    summary: 'Get messages for a DM / 특정 디엠의 대화내용 가져오기',
  })
  @Get(':dm_id/messages')
  getMessages() {}

  @ApiOperation({ summary: 'post messages / 특정 디엠에 대화내용 입력하기' })
  @Post(':dm_id/messages')
  postMessage() {}
}
