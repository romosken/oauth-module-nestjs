import { IsString, Length } from "class-validator";

export class ChangeUserPasswordDto {
  @IsString({ message: "Invalid Password!" })
  @Length(5, 20, { message: "Password must be between 5 and 20 characters!" })
  current_password: string;

  @IsString({ message: "Invalid Password!" })
  @Length(5, 20, { message: "Password must be between 5 and 20 characters!" })
  new_password: string;
}
