import { ConfigModule } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export default class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private config: ConfigModule) {}

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    return {
        

    };
  }
}
