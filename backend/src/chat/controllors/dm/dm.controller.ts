import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('dm')
export class DmController {
  @ApiOperation({ summary: 'get messages for a dm' })
  @Get(':dm_id/messages')
  getMessages() {}

  @ApiOperation({ summary: 'post messages' })
  @Post(':dm_id/messages')
  postMessage() {}
}
