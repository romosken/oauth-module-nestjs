import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 20 })
  password: string;

  // @ManyToOne(() => Role, (r) => r.id)
  // role: Role;

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
