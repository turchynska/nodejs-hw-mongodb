import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';


const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId,req: 'user', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
sessionSchema.post('save', handleSaveError);
sessionSchema.pre('findOneAndUpdate', setUpdateSettings);
sessionSchema.post('findOneAndUpdate', handleSaveError);

export const SessionsCollection = model('sessions', sessionSchema);