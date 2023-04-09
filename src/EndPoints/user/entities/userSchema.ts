import mongoose from 'mongoose';

/* eslint-disable prettier/prettier */
export let UserSchema = new mongoose.Schema(
  {
    userName: String,
    email: String,
    password: String,
    confirmPassword: String,
    profileImg: {
      type: String,
    },
    isUser: Boolean,
    // {
    //   data: Buffer,
    //   contentType: String,
    //   originalname: String,
    // },
  },
  { typeKey: '$type' },
);
