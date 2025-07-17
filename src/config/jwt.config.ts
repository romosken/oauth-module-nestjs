import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtOptionsFactory, JwtModuleOptions } from "@nestjs/jwt";

@Injectable()
export default class JwtConfig implements JwtOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.config.get<string>("JWT_SECRET"),
    };
  }
}
