import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
  } from "class-validator";

  
  export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @IsEmail()
    @IsNotEmpty()
    userName: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    password: string;
  }
  