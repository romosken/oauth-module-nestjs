import { Controller, Post, Body } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "./dto/login-response.dto";
import { SignInDto } from "./dto/signin.dto";
import { UserResponseDto } from "../users/dto/user-response.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(dto);
  }

  @Post("/signin")
  async signIn(@Body() dto: SignInDto): Promise<UserResponseDto> {
    return await this.authService.signIn(dto);
  }
}
