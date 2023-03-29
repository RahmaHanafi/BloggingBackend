import {
  BadRequestException,
  createParamDecorator,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostWithDTO } from './dto/postWithDTO';

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private PostModel) {}

  async create(post: PostWithDTO, decodedJwtAccessToken: any) {
    // console.log(file);

    // post.postImg = file.filename;
    if (!post.content && !post.postImg) {
      throw new BadRequestException('Empty post');
    }
    // const date = new Date();
    post.createdDate = Date();
    post.userId = decodedJwtAccessToken._id;
    let data = new this.PostModel(post);
    await data.save();
    return {
      statusCode: 200,
      message: 'created a new post successfully',
      data,
    };
  }

  async findAll() {
    let AllPosts = await this.PostModel.find({})
      .populate('userId')
      .sort({ createdDate: -1 });
    return AllPosts;
  }

  async findOne(_id: ObjectId, decodedJwtAccessToken: any) {
    let Post = await this.PostModel.findOne({ _id }).exec({});
    if (!Post) {
      throw new NotFoundException('No Post has this ID!');
    }

    // console.log(decodedJwtAccessToken._id, Post.userId.toString());

    if (Post.userId.toString() !== decodedJwtAccessToken._id) {
      throw new BadRequestException('No premission to access this post');
    }

    // let recivedJWT = context.switchToHttp().getRequest().header('x-auth-token');
    // const AuthUser =

    // createParamDecorator((data, req) => {
    //   return req.user;
    // });

    // console.log(AuthUser);

    // if(AuthUser.!== Post.userId){

    // }
    return { statusCode: 200, Post };
  }

  async update(
    _id: ObjectId,
    updatedPost: UpdatePostDto,
    decodedJwtAccessToken: any,
  ) {
    let Post = await this.PostModel.findOne({ _id }).exec({});
    if (Post.userId.toString() !== decodedJwtAccessToken._id) {
      throw new BadRequestException('No premission to access this post');
    }

    let updatePost = await this.PostModel.updateOne(
      { _id },
      { $set: updatedPost },
    );
    return {
      statusCode: 200,
      message: 'updated data successfully',
      updatePost,
    };
  }

  async remove(_id: ObjectId, decodedJwtAccessToken: any) {
    let Post = await this.PostModel.findOne({ _id }).exec({});
    if (Post.userId.toString() !== decodedJwtAccessToken._id) {
      throw new BadRequestException('No premission to access this post');
    }

    let AllPosts = await this.PostModel.deleteOne({ _id });
    return { message: 'removed Post successfully' };
  }

  // async uploadFile(file: Express.Multer.File) {
  //   // const imagname = this.fs.writeStreamToFile(
  //   //   'https://drive.google.com/drive/folders/14yl1UueKgfKRs41iy0qCF4ud4z9_CUoH',
  //   //   createReadStream(file.stream.),
  //   // );
  //   // console.log(imagname);

  //   // uploadFile(localFile: string) {
  //   //   return this.fs.writeStreamToFile('some/path', createReadStream(localFile))
  //   // }
  //   // if (data.modifiedCount === 0) {
  //   //   throw new BadRequestException(error);
  //   // }
  //   return {
  //     statusCode: 200,
  //     message: 'updated data successfully',
  //     data,
  //   };
  // }
}
