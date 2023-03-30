import {
  BadRequestException,
  Inject,
  Injectable,
  UploadedFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';
import { createReadStream } from 'fs';
import { Filesystem, IOnlineFilesystem } from 'like-fs';
import { ObjectId } from 'mongoose';
import multer, { Multer } from 'multer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserWithDTO } from './DTO/userModelWithDTO';
import { LoginWithDTO } from './DTO/loginModelWDTO';
import { UserUpdateWithDTO } from './DTO/userUpdateDTO';

let UserProjection = {
  confirmPassword: false,
  password: false,
  __v: false,
};
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private UserModel,
    @Inject(Filesystem) private readonly fs: IOnlineFilesystem,
    private jwtService: JwtService,
  ) {}

  private async findOneByEmail(email: string) {
    let isExist = await this.UserModel.findOne({ email: email });
    return isExist;
  }

  async create(user: UserWithDTO) {
    let isExist = await this.findOneByEmail(user.email);
    if (isExist) {
      throw new BadRequestException('Email is already exist.');
    }

    if (user.password !== user.confirmPassword) {
      throw new BadRequestException("Passwords don't match.");
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;
    let data = new this.UserModel({
      userName: user.userName,
      email: user.email,
      password: user.password,
      isUser: user.isUser,
    });
    await data.save();
    return { statusCode: 200, message: 'Sign up successfully', data };
  }

  async login(user: LoginWithDTO, res: Response) {
    let isExist = await this.findOneByEmail(user.email);

    if (!isExist) {
      throw new BadRequestException('Invalid email or password');
    }

    let checkPassword = await bcrypt.compare(user.password, isExist.password);

    if (!checkPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    let myJwt = await this.jwtService.signAsync(
      { email: user.email, isUser: user.isUser, _id: isExist._id },
      { secret: 'secret' },
    );
    // const decodedJwtAccessToken = this.jwtService.decode(myJwt);
    // console.log(decodedJwtAccessToken);

    res.header('x-auth-token', myJwt);
    res.cookie('x-auth-token', myJwt, { httpOnly: true });
    return { message: 'Login successfully', token: myJwt, user: isExist };
  }

  async findAll() {
    let AllUsers = await this.UserModel.find({}).exec();
    return AllUsers;
  }

  async findOne(decodedJwtAccessToken: any) {
    let user = await this.UserModel.findOne({ _id: decodedJwtAccessToken._id });
    if (!user) {
      throw new BadRequestException('No user has this ID!');
    }
    return { statusCode: 200, user };
  }

  async update(decodedJwtAccessToken: any, User: UserUpdateWithDTO) {
    let updateUser = await this.UserModel.updateOne(
      { _id: decodedJwtAccessToken._id },
      { $set: User },
    );
    return {
      statusCode: 200,
      message: 'updated data successfully',
      updateUser,
    };
  }

  async uploadFile(fileName: any, decodedJwtAccessToken: any) {
    let data = await this.UserModel.updateOne(
      { _id: decodedJwtAccessToken._id },
      {
        $set: {
          profileImg: fileName,
        },
      },
    );
    return {
      statusCode: 200,
      message: 'updated data successfully',
      data,
    };
  }

  // async remove(id: ObjectId) {
  //    return `This action removes a #${id} user`;
  // }

  // async remove(_id: string) {
  //   let AllStudents = await this.StudentModel.remove({ _id }).exec();
  //   return { message: 'removed student successfully' };

  //   // return AllStudents;
  //   // students = students.filter((s) => s.id != id);
  // }

  // async findStudentCourses(_id: string) {
  //   let student = await this.StudentModel.findOne({ _id }, courseProjection);
  //   let course = await this.CourseModel.find({
  //     _id: { $in: student.courseId },
  //   });
  //   return course;
  //   // return `This action returns a #${id} student`;
  // }
}

// uploadFile(localFile: string) {
//   return this.fs.writeStreamToFile('some/path', createReadStream(localFile))
// }
// if (data.modifiedCount === 0) {
//   throw new BadRequestException(error);
// }

// const imagname = this.fs.writeStreamToFile(
//   'https://drive.google.com/drive/folders/14yl1UueKgfKRs41iy0qCF4ud4z9_CUoH',
//   createReadStream(file.stream.),
// );
// console.log(imagname);
