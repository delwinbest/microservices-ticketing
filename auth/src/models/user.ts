import mongoose from 'mongoose';

// An interface that descibes the new user properties
interface UserAttrs {
  email: string;
  password: string;
}

//Interface the describes properties that User Model has
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Required to help typsescript and mongoose work
// Enables type checking by wrapping
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<any, UserModel>('User', userSchema);

// Required to help typsescript and mongoose work
// Enables type checking by wrapping
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export { User };
