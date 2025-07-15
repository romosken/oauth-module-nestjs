import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import {
  BaseErrorHandler,
  DuplicateEntityErrorHandler,
  HttpErrorHandler,
} from "./config/error-handling.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new BaseErrorHandler(httpAdapter),
    new DuplicateEntityErrorHandler(httpAdapter),
    new HttpErrorHandler(httpAdapter),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
