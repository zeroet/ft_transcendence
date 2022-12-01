import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string
      | { error: string; message: string[] };
    //   if (typeof err !== 'string' && err.error === 'Bad Requeset') {
    //     return response.status(status).json({
    //         success: false,
    //         code: status,

    //     })
    //   }
    console.log('HttpException', status, err);
    return response.status(status).json({ statusCode: status, err });
  }
}
