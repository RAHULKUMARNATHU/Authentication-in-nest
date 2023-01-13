import { IsEmail, IsNotEmpty } from "class-validator";

export class forgetPasswordDto {

    @IsNotEmpty()
    @IsEmail()
    userName: string;
}