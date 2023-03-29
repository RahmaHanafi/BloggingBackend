import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class UserWithDTO {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @Optional()
  profileImg: string = '';

  @IsBoolean()
  isUser: boolean = true;
}
