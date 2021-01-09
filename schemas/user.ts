import mongoose, { Schema, Document, Model } from 'mongoose';
import Hapi from '@hapi/hapi';

const UserSchema = new Schema({
  userAgent: String,
  ipAddress: String,
});

export interface IUser {
  userAgent: string;
  ipAddress: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}

const User = mongoose.model<IUserDocument, IUserModel>(
  'User',
  UserSchema,
);
export default User;

export async function returnUser(
  request: Hapi.Request,
): Promise<IUserDocument> {
  const userId = request.headers['user-id'];

  if (userId && mongoose.isValidObjectId(userId)) {
    const user = await User.findById(userId).exec();

    if (user && user.userAgent === request.headers['user-agent']) {
      return user;
    }
  }

  const user = await User.create({
    userAgent: request.headers['user-agent'],
    ipAddress: request.info.remoteAddress,
  });

  return user;
}
