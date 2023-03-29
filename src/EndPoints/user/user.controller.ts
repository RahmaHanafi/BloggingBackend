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

// @Controller('firebase')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
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

  // @userRoles(Role.User)
  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.userService.findOne(id);
  }

  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateUserDto: UserUpdateWithDTO) {
    return this.userService.update(id, updateUserDto);
  }

  @userRoles(Role.User)
  @Patch('upload/:id')
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
    @Param('id') _id: ObjectId,
  ) {
    console.log(file);
    let uploadImg = await this.firebaseService.uploadImage(file);
    return this.userService.uploadFile(uploadImg, _id);
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
