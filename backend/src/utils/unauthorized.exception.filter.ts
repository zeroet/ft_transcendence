import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  public catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string
      | { error: string; message: string[] };
    console.log('UnauthroizedException', status, err);
    return response.status(status).json({ statusCode: status, err });
  }
}
