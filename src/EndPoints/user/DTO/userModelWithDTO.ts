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
  @IsNotEmpty({ message: 'User Name is required!' })
  userName: string;

  @IsEmail({}, { message: 'Please, Enter correct email' })
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short!' })
  @IsNotEmpty({ message: 'password is required!' })
  password: string;

  @IsString()
  @MinLength(8, { message: 'Confirm password is too short!' })
  @IsNotEmpty({ message: 'Confrirm password is required!' })
  confirmPassword: string;

  @IsString()
  @Optional()
  profileImg: string = '';

  @IsBoolean()
  isUser: boolean = true;
}
