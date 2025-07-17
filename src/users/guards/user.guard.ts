import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RequestWithUser } from "./request-with-user.dto";
import { Role } from "../enums/role.enum";

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    if (params.id) return user.role === Role.Admin || user.sub === params.id;

    return true;
  }
}
