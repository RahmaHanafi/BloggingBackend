import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  UsePipes,
  createParamDecorator,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostWithDTO } from './dto/postWithDTO';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthUser, userRoles } from '../user/auth/user.decorator';
import { Role } from '../user/auth/user.enum';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}

  @userRoles(Role.User)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(
    FileInterceptor('postImg', {
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
  async create(
    @Body() createPostDto: PostWithDTO,
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: any,
  ) {
    if (file) {
      let uploadImg: any = await this.firebaseService.uploadImage(file);
      createPostDto.postImg = uploadImg;
      console.log(file);
    }
    const decodedJwtAccessToken = this.jwtService.decode(token);
    return this.postService.create(createPostDto, decodedJwtAccessToken);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @userRoles(Role.User)
  @Get(':id')
  findOne(@Param('id') _id: ObjectId, @Headers('Authorization') token: any) {
    // console.log(token);

    const decodedJwtAccessToken = this.jwtService.decode(token);
    // console.log(decodedJwtAccessToken);

    // const AuthUser = createParamDecorator((data, req) => {
    //   return req.user;
    // });
    return this.postService.findOne(_id, decodedJwtAccessToken);
  }

  @userRoles(Role.User)
  @UsePipes(ValidationPipe)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('postImg', {
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
  async update(
    @Param('id') _id: ObjectId,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: any,
  ) {
    const decodedJwtAccessToken = this.jwtService.decode(token);
    if (file) {
      let uploadImg: any = await this.firebaseService.uploadImage(file);
      updatePostDto.postImg = uploadImg;
      console.log(file);
    }
    return this.postService.update(_id, updatePostDto, decodedJwtAccessToken);
  }

  @Delete(':id')
  remove(@Param('id') _id: ObjectId, @Headers('Authorization') token: any) {
    const decodedJwtAccessToken = this.jwtService.decode(token);
    return this.postService.remove(_id, decodedJwtAccessToken);
  }

  // @Post('')
  // @UseInterceptors(
  //   FileInterceptor('postImg', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         callback(null, `${Date.now()}.${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   // @Param('id') _id: ObjectId,
  // ) {
  //   console.log(file);
  //   return file;
  // }
}
