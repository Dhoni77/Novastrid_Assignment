import { Request, Response } from "express";
import UserModel from "../models/User";
import { Op } from "sequelize";
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';

function isUserValid(user: UserModel) {
  if (!user) {
    return false;
  }

  if (user?.name === null && user.name.length === 0) {
    return false;
  }

  if (user?.email === null && user.email.length === 0) {
    return false;
  }

  if (user.password === null && user.password.length === 0) {
    return false;
  }

  return true;
}

export async function createUser(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!isUserValid(req.body)) {
    return res.json(400).json({
      message: "Invalid user data"
    })
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);
  let user;

  try {
    user = await UserModel.create({
      name,
      email,
      password: hashedPassword
    });
  }
  catch (err) {
    return res.status(404).json({
      message: 'Unable to create user'
    })
  }

  return res.status(201).json({
    user: user,
    message: 'The user has been created successfully'
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  let user: UserModel;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Provided email or password is invalid'
    })
  }

  try {
    user = await UserModel.findOne({
      where: {
        email: {
          [Op.eq]: email
        }
      }
    })

    // check password
    const isPasswordValid = async () => {
      const isValid = await bcrypt.compare(password, user.password);
      return isValid;
    }

    const payload = {
      id: user.id
    }

    if (isPasswordValid()) {
      const token = jwt.sign(payload, 'secret');

      return res.status(200).json({
        token,
        message: 'User login succeeded!'
      })
    }
  }
  catch (error) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  return res.status(404).json({
    message: 'User not found'
  });
}