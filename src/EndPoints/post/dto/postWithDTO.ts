import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/* eslint-disable prettier/prettier */
export class PostWithDTO {
  @IsString()
  @Optional()
  Title: string = '';

  @IsString()
  @Optional()
  content: string = '';

  @IsString()
  @Optional()
  postImg: string = '';

  @IsString()
  // @IsNotEmpty()
  createdDate: string = '';

  @IsString()
  // @IsNotEmpty()
  userId: string = '';
}
