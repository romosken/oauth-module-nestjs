import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import JwtConfig from "src/config/jwt.config";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
