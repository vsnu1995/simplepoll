import mongoose, { Schema, Document, Model } from 'mongoose';

const ResponseSchema = new Schema(
  {
    pollId: mongoose.Types.ObjectId,
    responseIndexes: [Number],
    userId: mongoose.Types.ObjectId,
  },
  { timestamps: true },
);

ResponseSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export interface IResponse {
  pollId: mongoose.Types.ObjectId;
  responseIndexes: [number];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponseDocument extends IResponse, Document {}

export interface IResponseModel extends Model<IResponseDocument> {}

export default mongoose.model<IResponseDocument, IResponseModel>(
  'Response',
  ResponseSchema,
);
