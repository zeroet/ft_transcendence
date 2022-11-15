import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  testReq(): string {
    return "시발 왜 또 db 연동안되냐 짜증나게";
  }
}
