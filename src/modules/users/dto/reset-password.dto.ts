import { IsNotEmpty, IsString } from "class-validator"

export class resetPasswordDto {
    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    confirmPassword: string
}