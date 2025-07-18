import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { BypassAuth } from "../decorators/bypass-auth.decorator";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../auth.service";
import { RequestWithUser } from "../dto/request-with-user.dto";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly service: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.checkBypass(context)) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const payload =
      await this.service.validateAccessTokenAndGetPayload(request);

    request.user = payload;
    return true;
  }

  private checkBypass(context: ExecutionContext) {
    const bypass = this.reflector.getAllAndOverride<boolean>(BypassAuth, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (bypass) return true;
  }
}
