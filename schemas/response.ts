import mongoose, { Schema, Document, Model } from 'mongoose';

const Response = new Schema(
  {
    pollId: mongoose.Types.ObjectId,
    responsIndexes: [Number],
    userId: mongoose.Types.ObjectId,
  },
  { timestamps: true },
);

Response.index({ pollId: 1, userId: 1 }, { unique: true });

export interface Response {
  pollId: mongoose.Types.ObjectId;
  responsIndexes: [number];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseDocument extends Response, Document {}

export interface ResponseModel extends Model<ResponseDocument> {}

export default mongoose.model<ResponseDocument, ResponseModel>(
  'Response',
  Response,
);
