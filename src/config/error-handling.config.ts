import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import ErrorDto from "./error.dto";
import { QueryFailedError } from "typeorm";
import HttpExceptionDto from "./http-exception.dto";

const logger = new Logger("ExceptionHandler");

function logError(exception: Error) {
  logger.error(`${exception.name}: ${exception.message}`);
}
function buildErrorDto(
  status: number,
  url: string,
  message: string | string[],
) {
  const messageArray: string[] =
    typeof message === "string" ? [message] : message;
  return new ErrorDto(status, url, messageArray);
}

@Catch()
class BaseErrorHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    logError(exception);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const url = String(httpAdapter.getRequestUrl(ctx.getRequest()));
    const responseBody = buildErrorDto(httpStatus, url, exception.message);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

@Catch(HttpException)
class HttpErrorHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    logError(exception);

    const exResponse = exception.getResponse();

    const exceptionObj: HttpExceptionDto = new HttpExceptionDto(exResponse);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exceptionObj.statusCode;

    const url = String(httpAdapter.getRequestUrl(ctx.getRequest()));
    const responseBody = buildErrorDto(httpStatus, url, exceptionObj.message);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

@Catch(QueryFailedError)
class DuplicateEntityErrorHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    logError(exception);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = HttpStatus.CONFLICT;

    const url = String(httpAdapter.getRequestUrl(ctx.getRequest()));
    const responseBody = buildErrorDto(httpStatus, url, exception.message);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

export { BaseErrorHandler, DuplicateEntityErrorHandler, HttpErrorHandler };
