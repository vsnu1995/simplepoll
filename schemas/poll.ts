import mongoose, { Schema, Document, Model } from 'mongoose';

const Poll = new Schema(
  {
    question: String,
    options: [String],
    multiSelect: Boolean,
    optionsAddable: Boolean,
    creatorId: mongoose.Types.ObjectId,
  },
  { timestamps: true },
);

export interface Poll {
  question: string;
  options: [string];
  multiSelect: boolean;
  optionsAddable: boolean;
  creatorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PollDocument extends Poll, Document {}

export interface PollModel extends Model<PollDocument> {}

export default mongoose.model<PollDocument, PollModel>('Poll', Poll);
