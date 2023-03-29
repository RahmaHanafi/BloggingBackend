import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import * as serviceAccount from '../../blog-5addf-firebase-adminsdk-z7ivj-66f2eda16d.json';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import * as fs from 'fs';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'gs://blog-5addf.appspot.com',
});

const bucket = admin.storage().bucket();

@Injectable()
export class FirebaseService {
  async uploadImage(file: Express.Multer.File) {
    const fileName = uuid() + '-' + file.originalname;
    const fileUpload = bucket.file('images/' + fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        fileUpload
          .getSignedUrl({ action: 'read', expires: '03-09-2491' })
          .then((signedUrls) => {
            resolve(
              // `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`,
              signedUrls[0],
            );
            console.log(signedUrls[0]);
          });
      });

      fs.createReadStream(file.path).pipe(stream);
      stream.on('error', reject);

      // return imgURL;

      //  let imgURL = task

      // stream.end(file.buffer);
    });
  }
}
