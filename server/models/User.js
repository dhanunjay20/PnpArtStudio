// api/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String, unique: true, required: true, index: true, lowercase: true, trim: true
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    isAdmin: { type: Boolean, default: false } // flag for admin portal access
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

export default mongoose.model('User', UserSchema);
