import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginResponseDto } from "../dto/login-response.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UserResponseDto } from "../dto/user-response.dto";
import { JwtService } from "@nestjs/jwt";
import JwtPayload from "../dto/jwt-payload.dto";
import { Role } from "../enums/role.enum";
import { Request } from "express";

//TODO extract to other module

@Injectable()
export class AuthService {
  private readonly tokenType: string;
  private readonly accessExpiration: number;
  private readonly refreshExpiration: number;
  private readonly bcryptRounds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.tokenType = String(this.config.get("JWT_TYPE"));
    this.accessExpiration = +this.config.get("ACCESS_TOKEN_EXPIRATION")!;
    this.refreshExpiration = +this.config.get("REFRESH_TOKEN_EXPIRATION")!;
    this.bcryptRounds = +this.config.get("BCRYPT_ROUNDS")!;
  }

  async validatePassword(validate: string, correct: string) {
    if (!(await bcrypt.compare(validate, correct)))
      throw new UnauthorizedException("Invalid credentials!");
  }

  generateTokenResponse(user: UserResponseDto) {
    const accessToken = this.generateJwt(
      user.id,
      user.role,
      this.accessExpiration,
    );

    const refreshToken = this.generateJwt(
      user.id,
      user.role,
      this.refreshExpiration,
    );

    return new LoginResponseDto(
      accessToken,
      refreshToken,
      this.accessExpiration,
      this.tokenType,
    );
  }

  generateJwt(userId: string, userRole: Role, expiration: number): string {
    const { ...payload } = new JwtPayload(userId, userRole, expiration);
    return this.jwtService.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptRounds);
  }

  async validateTokenAndGetPayload(request: Request) {
    try {
      const token = this.extractTokenFromHeader(request);
      return await this.getValidatedPayload(token);
    } catch (e) {
      throw new UnauthorizedException("Authorization missing or invalid!");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === this.tokenType ? token : undefined;
  }

  private async getValidatedPayload(token: string | undefined) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token!);
    const now = new Date().valueOf();
    if (payload.exp < now) throw new UnauthorizedException();
    return payload;
  }
}
