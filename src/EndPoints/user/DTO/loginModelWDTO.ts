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
  @IsEmail({}, { message: 'Please, Enter correct email' })
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;

  @IsBoolean()
  isUser: boolean = true;
}
