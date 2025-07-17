import { Role } from "../enums/role.enum";
import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<Role[]>();

//The difference is that with @SetMetadata you have more control over the metadata key and value, and also can create decorators that take more than one argument.
// export const ROLES_KEY = "roles";
// export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
