import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { Role } from "./role.enum";
import { Exclude } from "class-transformer";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 60 })
  @Exclude()
  password: string;

  @Column({ enum: Role, default: Role.User })
  role: Role;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  static fromCreateDto(dto: CreateUserDto): User {
    const entity = new User();
    entity.email = dto.email;
    entity.password = dto.password;
    return entity;
  }
}
