import { Controller, Post, Body } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { LoginResponseDto } from "../dto/login-response.dto";
import { SignInDto } from "../dto/signin.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { UsersService } from "../service/users.service";
import { BypassAuth } from "../decorators/bypass-auth.decorator";

@Controller("auth")
@BypassAuth()
export class AuthController {
  constructor(private readonly service: UsersService) {}

  @Post("/login")
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.service.login(dto);
  }

  @Post("/signin")
  async signIn(@Body() dto: SignInDto): Promise<UserResponseDto> {
    return await this.service.signIn(dto);
  }
}
