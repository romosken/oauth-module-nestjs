import { Controller, Post, Body } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { SignInDto } from "./dto/signin.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { UsersService } from "../users.service";

import { BypassAuth } from "./decorators/bypass-auth.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@BypassAuth()
export class AuthController {
  constructor(
    private readonly service: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post("/login")
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.service.login(dto);
  }

  @Post("/signin")
  async signIn(@Body() dto: SignInDto): Promise<UserResponseDto> {
    return await this.service.signIn(dto);
  }

  @Post("/refresh")
  async refresh(@Body() dto: RefreshTokenDto): Promise<LoginResponseDto> {
    return await this.authService.refreshToken(dto.refresh_token);
  }
}
