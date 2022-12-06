import { Injectable } from '@nestjs/common';
import { IDmService } from './dm.interface';

@Injectable()
export class DmService implements IDmService {
  getMembers(dmId: number) {}
  postMembers(userId: number, dmId: number) {}
  getContents(userId: number, dmId: number) {}
  postContents(userId: number, dmId: number, content: string) {}
}
