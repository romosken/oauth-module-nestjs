import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import {
  BaseErrorHandler,
  HttpErrorHandler,
} from "./config/error-handling.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  putGlobalPipes(app);
  // putGlobalFilters(app);
  await app.listen(process.env.PORT || 3000);
}

function putGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

// function putGlobalFilters(app: INestApplication) {
//   const httpAdapter = app.get(HttpAdapterHost);
//   app.useGlobalFilters(
//     new BaseErrorHandler(httpAdapter),
//     new HttpErrorHandler(httpAdapter),
//   );
// }

bootstrap();
