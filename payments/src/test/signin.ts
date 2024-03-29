import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signin = (id?: string) => {
  // Build a JWT payload {id, email}
  const payload = {
    id: id || mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build a session Object { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  /// return a string thats the cookie with encoded json data
  return [`express:sess=${base64}`];
};
