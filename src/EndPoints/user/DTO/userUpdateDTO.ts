import { Optional } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/* eslint-disable prettier/prettier */
export class UserUpdateWithDTO {
  @IsString()
  @MinLength(3)
  @IsOptional()
  userName: string = '';

  // @IsEmail()
  // @IsOptional()
  // email: string = '';

  // @MinLength(8)
  // @Optional()
  // password: string = '';
}
