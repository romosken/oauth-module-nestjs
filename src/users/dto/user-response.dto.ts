import { Exclude, Expose } from "class-transformer";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.enum";

export class UserResponseDto {
  constructor(entity: User) {
    this.id = entity.id;
    this.email = entity.email;
    this.password = entity.password;
    this.role = entity.role;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt ?? undefined;
  }
  id: string;

  email: string;

  // @Exclude()
  password: string;

  role: Role;

  @Expose({ name: "updated_at" })
  updatedAt: Date;

  @Expose({ name: "deleted_at" })
  deletedAt: Date;
}
