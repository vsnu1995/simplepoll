import mongoose, { Schema, Document, Model } from 'mongoose';

const PollSchema = new Schema(
  {
    question: String,
    options: [String],
    multiSelect: Boolean,
    optionsAddable: Boolean,
    creatorId: mongoose.Types.ObjectId,
  },
  { timestamps: true },
);

export interface IPoll {
  question: string;
  options: [string];
  multiSelect: boolean;
  optionsAddable: boolean;
  creatorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPollPayload {
  question: string;
  options: [string];
  multiSelect: boolean;
  optionsAddable: boolean;
}

export interface IPollDocument extends IPoll, Document {}

export interface IPollModel extends Model<IPollDocument> {}

export default mongoose.model<IPollDocument, IPollModel>(
  'Poll',
  PollSchema,
);
