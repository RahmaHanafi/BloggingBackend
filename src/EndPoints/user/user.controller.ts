import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  Put,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ObjectId } from 'mongoose';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { userRoles } from './auth/user.decorator';
import { Role } from './auth/user.enum';
import { UserService } from './user.service';
import { UserWithDTO } from './DTO/userModelWithDTO';
import { LoginWithDTO } from './DTO/loginModelWDTO';
import { UserUpdateWithDTO } from './DTO/userUpdateDTO';
import { FirebaseService } from './../../firebase/firebase.service';
import { Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// @Controller('firebase')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}
  @UsePipes(ValidationPipe)
  @Post('register')
  create(@Body() createUserDto: UserWithDTO) {
    return this.userService.create(createUserDto);
  }

  // @userRoles(Role.User)
  @UsePipes(ValidationPipe)
  @Post('login')
  login(
    @Body() loginUserDto: LoginWithDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.login(loginUserDto, response);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @userRoles(Role.User)
  @Get('myAccount')
  findOne(@Headers('Authorization') token: any) {
    const decodedJwtAccessToken = this.jwtService.decode(token);
    return this.userService.findOne(decodedJwtAccessToken);
  }

  @userRoles(Role.User)
  @UsePipes(ValidationPipe)
  @Patch()
  update(
    @Headers('Authorization') token: any,
    @Body() updateUserDto: UserUpdateWithDTO,
  ) {
    const decodedJwtAccessToken = this.jwtService.decode(token);
    return this.userService.update(decodedJwtAccessToken, updateUserDto);
  }

  @userRoles(Role.User)
  @Patch('upload/')
  @UseInterceptors(
    FileInterceptor('profileImg', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}.${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: any,
  ) {
    console.log(file);
    let uploadImg = await this.firebaseService.uploadImage(file);
    const decodedJwtAccessToken = this.jwtService.decode(token);
    return this.userService.uploadFile(uploadImg, decodedJwtAccessToken);
  }

  // let upload = multer({ storage: store }).single('file');

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }

  // @Get(':_id/courses')
  // findStudentCourses(@Param('_id') id: string) {
  //   return this.studentService.findStudentCourses(id);
  // }

  // function generateFilename(file) {
  //   return `${Date.now()}.${extname(file.originalname)}`;
  // }
  //,{
  //   // storage: diskStorage({
  //   //   destination: '../../uploads',
  //   //   // filename: editFileName,
  //   // }),
  //   // fileFilter: imageFileFilter,
  // }
}
