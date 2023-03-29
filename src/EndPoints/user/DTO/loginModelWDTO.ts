import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  isValidationOptions,
  MinLength,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class LoginWithDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isUser: boolean = true;
}
