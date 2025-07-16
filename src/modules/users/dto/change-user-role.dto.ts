import { IsEnum } from "class-validator";
import { Role } from "../entities/role.enum";

export class ChangeUserRoleDto {
  @IsEnum(Role, { message: "Invalid role!" })
  role: Role;
}
