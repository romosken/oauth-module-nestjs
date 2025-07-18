import { Role } from "src/users/enums/role.enum";
import { TokenType } from "../enums/token-type.enum";

export default class JwtPayload {
  constructor(sub: string, role: Role, exp: number, type: TokenType) {
    this.sub = sub;
    this.role = role;
    const now = new Date().valueOf();
    this.iat = now;
    this.exp = now + exp * 1000;
    this.type = type;
  }
  sub: string;
  role: Role;
  iat: number;
  exp: number;
  type: TokenType;
}
