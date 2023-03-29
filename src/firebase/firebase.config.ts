// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';

import { getAnalytics } from 'firebase/analytics';

import { getFirestore } from 'firebase/firestore/lite';

import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyCfWop9YfGiCPg7sg_ypYXRXSJ6_w-V6Ts',

  authDomain: 'blog-5addf.firebaseapp.com',

  projectId: 'blog-5addf',

  storageBucket: 'blog-5addf.appspot.com',

  messagingSenderId: '559393736252',

  appId: '1:559393736252:web:dcc5eb8ffd98e1d0d22539',

  measurementId: 'G-VWG90JJLHG',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// export const auth = getAuth(app);

export default getFirestore(app);
