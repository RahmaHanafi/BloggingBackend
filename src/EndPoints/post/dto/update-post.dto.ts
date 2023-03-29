import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Optional()
  Title: string = '';

  @IsString()
  @Optional()
  content: string = '';

  @IsString()
  @Optional()
  postImg: string = '';
}
