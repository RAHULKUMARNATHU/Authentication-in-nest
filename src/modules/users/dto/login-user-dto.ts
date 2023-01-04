import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
