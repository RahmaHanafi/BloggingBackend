import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/userSchema';
import { GCSFilesystem, GCSFilesystemModule } from 'like-fs-gcs';
import { Filesystem } from 'like-fs';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    GCSFilesystemModule.forRoot({
      storageBucket: 'my-storage-bucket',
    }),
    JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1d' } }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: Filesystem, useExisting: GCSFilesystem },
    FirebaseService,
  ],
})
export class UserModule {}
