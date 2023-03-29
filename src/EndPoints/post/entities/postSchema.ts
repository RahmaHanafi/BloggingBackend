import mongoose, { Types } from 'mongoose';

/* eslint-disable prettier/prettier */
export let PostSchema = new mongoose.Schema({
  Title: String,
  content: String,
  postImg: String,
  createdDate: Date,
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
});
