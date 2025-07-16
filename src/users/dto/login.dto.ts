import { IsEmail, IsString, Length } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Invalid email address!" })
  email: string;

  @IsString({ message: "Invalid Password!" })
  @Length(5, 20, { message: "Password must be between 5 and 20 characters!" })
  password: string;
}
