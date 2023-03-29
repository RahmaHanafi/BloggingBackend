import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostSchema } from './entities/postSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1d' } }),
  ],
  controllers: [PostController],
  providers: [PostService, FirebaseService],
})
export class PostModule {}
