import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import JwtPayload from "./dto/jwt-payload.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { Request } from "express";
import { TokenType } from "./enums/token-type.enum";
import { Role } from "../enums/role.enum";

@Injectable()
export class AuthService {
  private readonly authType: string;
  private readonly accessExpiration: number;
  private readonly refreshExpiration: number;
  private readonly bcryptRounds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.authType = String(this.config.get("JWT_TYPE"));
    this.accessExpiration = +this.config.get("ACCESS_TOKEN_EXPIRATION")!;
    this.refreshExpiration = +this.config.get("REFRESH_TOKEN_EXPIRATION")!;
    this.bcryptRounds = +this.config.get("BCRYPT_ROUNDS")!;
  }

  async validatePassword(validate: string, correct: string) {
    if (!(await bcrypt.compare(validate, correct)))
      throw new UnauthorizedException("Invalid credentials!");
  }

  generateTokenResponse(user: UserResponseDto) {
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id, user.role);

    return this.generateLoginResponse(accessToken, refreshToken);
  }

  private generateAccessToken(id: string, role: Role) {
    return this.generateJwt(
      new JwtPayload(id, role, this.accessExpiration, TokenType.Access),
    );
  }

  private generateJwt(payload: JwtPayload): string {
    const { ...deconstructedPayload } = payload;
    return this.jwtService.sign(deconstructedPayload);
  }

  private generateRefreshToken(id: string, role: Role) {
    return this.generateJwt(
      new JwtPayload(id, role, this.refreshExpiration, TokenType.Refresh),
    );
  }

  private generateLoginResponse(accessToken: string, refreshToken: string) {
    return new LoginResponseDto(
      accessToken,
      refreshToken,
      this.accessExpiration,
      this.authType,
    );
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptRounds);
  }

  async validateAccessTokenAndGetPayload(request: Request) {
    try {
      const token = this.extractTokenFromHeader(request);
      return await this.getValidatedPayload(token, TokenType.Access);
    } catch (e) {
      throw new UnauthorizedException("Authorization missing or invalid!");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === this.authType ? token : undefined;
  }

  private async getValidatedPayload(
    token: string | undefined,
    type: TokenType,
  ) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token!);
    this.checkTokenExpiration(payload);
    this.checkTokenType(payload, type);
    return payload;
  }

  private checkTokenExpiration(payload: JwtPayload) {
    const now = new Date().valueOf();
    if (payload.exp < now) throw new UnauthorizedException("Expired token!");
  }

  private checkTokenType(payload: JwtPayload, type: TokenType) {
    if (payload.type !== type)
      throw new ForbiddenException("Wrong token type!");
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.getValidatedPayload(
      refreshToken,
      TokenType.Refresh,
    );
    const accessToken = this.generateRefreshToken(payload.sub, payload.role);

    return this.generateLoginResponse(accessToken, refreshToken);
  }
}
