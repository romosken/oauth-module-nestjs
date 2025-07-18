import { IsEmail, IsString, Length } from "class-validator";
import { SignInDto } from "../auth/dto/signin.dto";

export class CreateUserDto {
  constructor(signIn: SignInDto) {
    this.email = signIn.email;
    this.password = signIn.password;
  }

  @IsEmail({}, { message: "Invalid email address!" })
  email: string;

  @IsString({ message: "Invalid Password!" })
  @Length(5, 20, { message: "Password must be between 5 and 20 characters!" })
  password: string;
}
