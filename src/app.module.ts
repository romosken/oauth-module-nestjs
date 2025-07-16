import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import DatabaseConfig from "./config/database.config";
import { AppController } from "./app.controller";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import {
  BaseErrorHandler,
  HttpErrorHandler,
} from "./config/error-handling.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: BaseErrorHandler,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorHandler,
    },
  ],
})
export class AppModule {}
