import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { UserResponseDto } from "../users/dto/user-response.dto";
import { JwtService } from "@nestjs/jwt";
import JwtPayload from "./dto/jwt-payload.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInDto } from "./dto/signin.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.findByEmail(dto.email);
      await this.validatePassword(dto, user);
      return this.generateTokenResponse(user);
    } catch (error) {
      throw new UnauthorizedException("The email/password is wrong!");
    }
  }

  private async validatePassword(dto: LoginDto, user: UserResponseDto) {
    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException("Password doesn't match!");
  }

  private generateTokenResponse(user: UserResponseDto) {
    const accessTokenExpiration = +this.config.get("ACCESS_TOKEN_EXPIRATION")!;
    const accessToken = this.generateJwt(user, accessTokenExpiration);

    const refreshTokenExpiration = +this.config.get(
      "REFRESH_TOKEN_EXPIRATION",
    )!;
    const refreshToken = this.generateJwt(user, refreshTokenExpiration);

    return new LoginResponseDto(
      accessToken,
      refreshToken,
      accessTokenExpiration,
      this.config.get("JWT_TYPE")!,
    );
  }

  private generateJwt(user: UserResponseDto, expiration: number): string {
    const { ...payload } = new JwtPayload(user.id, user.role, expiration);
    return this.jwtService.sign(payload);
  }

  async signIn(dto: SignInDto): Promise<UserResponseDto> {
    dto.password = await this.hashPassword(dto.password);
    return await this.userService.create(new CreateUserDto(dto));
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds: number = +this.config.get<number>("BCRYPT_ROUNDS")!;
    return bcrypt.hash(password, rounds);
  }
}
