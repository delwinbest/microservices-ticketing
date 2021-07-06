import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that descibes the new user properties
interface UserAttrs {
  email: string;
  password: string;
}

//Interface the describes properties that User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Interface that describes the properties that a user DOCUMENT has
// (mongoose DB document has additional properties)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

// Intercept the save and perform this function
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Required to help typsescript and mongoose work
// Enables type checking by wrapping
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// Required to help typsescript and mongoose work
// Enables type checking by wrapping
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export { User };
