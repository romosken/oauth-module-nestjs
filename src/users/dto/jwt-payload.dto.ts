import { Role } from "src/users/enums/role.enum";

export default class JwtPayload {
  constructor(sub: string, role: Role, exp: number) {
    this.sub = sub;
    this.role = role;
    const now = new Date().valueOf();
    this.iat = now;
    this.exp = now + exp * 1000;
  }
  sub: string;
  role: Role;
  iat: number;
  exp: number;
}
