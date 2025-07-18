import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth/auth.controller";
import { AuthGuard } from "./auth/guards/auth.guard";
import JwtConfig from "src/config/jwt.config";
import { AuthService } from "src/users/auth/auth.service";

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
