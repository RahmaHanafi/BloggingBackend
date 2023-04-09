import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './EndPoints/post/post.module';
import { UserModule } from './EndPoints/user/user.module';
import { RolesGuard } from './EndPoints/user/auth/user.guard';

import { FirebaseService } from './firebase/firebase.service';

@Module({
  imports: [
    UserModule,
    PostModule,
    MongooseModule.forRoot(
      'mongodb+srv://rahmahanafi:iqzC8CDVB4zTK4w@blogging.sqnc3fe.mongodb.net/?retryWrites=true&w=majority',
      // 'mongodb://127.0.0.1:27017/blog',
    ),
    JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1d' } }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
    FirebaseService,
  ],
})
export class AppModule {}
