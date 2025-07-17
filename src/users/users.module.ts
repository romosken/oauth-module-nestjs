import { Module } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { UsersController } from "./controller/users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { AuthGuard } from "./guards/auth.guard";
import JwtConfig from "src/config/jwt.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    UsersModule,
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class UsersModule {}
