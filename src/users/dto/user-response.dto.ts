import { User } from "../entities/user.entity";

export class UserResponseDto {
  constructor(entity: User) {
    this.id = entity.id;
    this.email = entity.email;
  }
  id: string;
  email: string;
}
