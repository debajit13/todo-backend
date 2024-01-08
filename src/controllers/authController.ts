import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      return res.status(400).json({
        error: true,
        message: 'firstName, lastName, email and password are required fields!',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'User is already existed!',
      });
    }

    const encryptedPassword: string = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    if (user) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET || 'Backend-ToDo',
        {
          expiresIn: '2h',
        }
      );
      user.password = undefined;
      user.token = token;
    }

    return res.status(200).json({
      error: false,
      message: 'User created successfully!',
      user,
    });
  } catch (error) {
    console.error(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        error: true,
        message: 'email and password are required fields!',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User hasn't registered yet!",
      });
    }
    if (
      user &&
      user?.password &&
      (await bcrypt.compare(password, user?.password))
    ) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET || 'Backend-ToDo',
        {
          expiresIn: '2h',
        }
      );
      user.password = undefined;
      user.token = token;

      return res.status(200).json({
        error: false,
        message: 'User loggedIn successfully!',
        user,
      });
    }

    return res.status(401).json({
      error: true,
      message: 'Password is wrong!',
    });
  } catch (error) {
    console.error(error);
  }
};

export { register, login };
