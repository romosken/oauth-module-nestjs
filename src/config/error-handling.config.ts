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

function handleException(
  exception: Error,
  httpAdapterHost: HttpAdapterHost,
  host: ArgumentsHost,
  httpStatus: number,
  message: string[],
) {
  logError(exception);

  const { httpAdapter } = httpAdapterHost;

  const ctx = host.switchToHttp();

  const url = String(httpAdapter.getRequestUrl(ctx.getRequest()));

  const responseBody = buildErrorDto(httpStatus, url, message);

  httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
}



@Catch()
class BaseErrorHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    handleException(
      exception,
      this.httpAdapterHost,
      host,
      HttpStatus.INTERNAL_SERVER_ERROR,
      [exception.message],
    );
  }
}

@Catch(HttpException)
class HttpErrorHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const exResponse = exception.getResponse();

    const treatedResponse =
      typeof exResponse === "string"
        ? {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: [exResponse],
          }
        : exResponse;

    const exceptionObj = new HttpExceptionDto(treatedResponse);

    handleException(
      exception,
      this.httpAdapterHost,
      host,
      exceptionObj.statusCode,
      exceptionObj.message,
    );
  }
}

export { BaseErrorHandler, HttpErrorHandler };
