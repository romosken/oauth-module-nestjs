import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
  async login(_loginDto: LoginDto): Promise<LoginResponseDto> {
    return new LoginResponseDto();
  }
}
