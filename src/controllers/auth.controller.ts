import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "lawfirm_secret";
const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] || "1d";

// Create Client
export const clientRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser.length > 0) {
      return res.status(409).json({
        status: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await UserModel.createClient({
      full_name,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(200).json({
      status: true,
      message: "Client registered successfully",
      data: {
        user_id: result.insertId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//Client Login 
export const clientLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    const users = await UserModel.clientLogin(email);
    if (users.length === 0) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const tokenExpiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await UserModel.updateToken(user.id, token);

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
        token_expired_at: tokenExpiredAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

