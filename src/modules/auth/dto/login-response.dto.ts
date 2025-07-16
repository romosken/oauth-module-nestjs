import { Expose } from "class-transformer";

export class LoginResponseDto {
  constructor(
    access: string,
    refresh: string,
    expiration: number,
    type: string,
  ) {
    this.accessToken = access;
    this.refreshToken = refresh;
    this.expiresIn = expiration;
    this.tokenType = type;
  }
  @Expose({ name: "access_token" })
  accessToken: string;
  @Expose({ name: "token_type" })
  tokenType: string;
  @Expose({ name: "expires_in" })
  expiresIn: number;
  @Expose({ name: "refresh_token" })
  refreshToken: string;
}
