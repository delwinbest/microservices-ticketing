import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@drbtickets/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email address in use');
    }

    // Hash the password before storing
    // TODO: Has password

    //Create user
    const user = User.build({
      email,
      password,
    });

    //Save user to DB
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!, // Check for key in index.js
    );

    // Store it on the session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
    // console.log('User succesfully created');
  },
);

export { router as signupRouter };
