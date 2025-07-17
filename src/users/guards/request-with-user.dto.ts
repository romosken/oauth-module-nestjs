import { Request } from "express";
import JwtPayload from "../dto/jwt-payload.dto";

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
