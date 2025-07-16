import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginResponseDto } from "../dto/login-response.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UserResponseDto } from "../dto/user-response.dto";
import { JwtService } from "@nestjs/jwt";
import JwtPayload from "../dto/jwt-payload.dto";
import { Role } from "../entities/role.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validatePassword(validate: string, correct: string) {
    if (!(await bcrypt.compare(validate, correct)))
      throw new UnauthorizedException("Invalid credentials!");
  }

  generateTokenResponse(user: UserResponseDto) {
    const accessTokenExpiration = +this.config.get("ACCESS_TOKEN_EXPIRATION")!;
    const accessToken = this.generateJwt(
      user.id,
      user.role,
      accessTokenExpiration,
    );

    const refreshTokenExpiration = +this.config.get(
      "REFRESH_TOKEN_EXPIRATION",
    )!;
    const refreshToken = this.generateJwt(
      user.id,
      user.role,
      refreshTokenExpiration,
    );

    return new LoginResponseDto(
      accessToken,
      refreshToken,
      accessTokenExpiration,
      String(this.config.get("JWT_TYPE")),
    );
  }

  generateJwt(userId: string, userRole: Role, expiration: number): string {
    const { ...payload } = new JwtPayload(userId, userRole, expiration);
    return this.jwtService.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    const rounds: number = +this.config.get<number>("BCRYPT_ROUNDS")!;
    return bcrypt.hash(password, rounds);
  }
}
