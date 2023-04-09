import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class UserProfileImgWithDTO {
  @IsString()
  @IsNotEmpty()
  profileImg: string = '';

  // @IsEmail()
  // @IsOptional()
  // email: string = '';

  // @MinLength(8)
  // @Optional()
  // password: string = '';
}
