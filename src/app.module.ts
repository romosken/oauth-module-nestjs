import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import DatabaseConfig from "./config/database.config";
import { AppController } from "./app.controller";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import {
  BaseErrorHandler,
  HttpErrorHandler,
} from "./config/error-handling.config";
import { AuthModule } from "./modules/auth/auth.module";

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
    AuthModule,
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
