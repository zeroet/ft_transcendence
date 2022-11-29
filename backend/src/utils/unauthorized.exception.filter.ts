import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  public catch(
    exception: UnauthorizedException,
    host: ArgumentsHost,
  ): Response {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    return response.status(401).json({ statusCode: 401 });
  }
}
