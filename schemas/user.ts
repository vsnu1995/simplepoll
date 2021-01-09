import mongoose, { Schema, Document, Model } from 'mongoose';

const User = new Schema({
  userAgent: String,
  ipAddress: String,
});

export interface User {
  userAgent: string;
  ipAddress: string;
}

export interface UserDocument extends User, Document {}

export interface UserModel extends Model<UserDocument> {}

export default mongoose.model<UserDocument, UserModel>('User', User);
