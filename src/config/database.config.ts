import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";


//TODO add secrets manager reading


@Injectable()
export default class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: this.config.get<number>("DATABASE_PORT"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      database: this.config.get<string>("DATABASE_NAME"),
      // entities: [__dirname + "/**/*.entity{.ts,.js}"],
      migrationsTableName: "migrations",
      migrations: ["src/migrations/*{.ts,.js}"],
      autoLoadEntities: true,
      // cli: {
      //   migrationsDir: "src/migrations",
      // },
      synchronize: true,
    };
  }
}
