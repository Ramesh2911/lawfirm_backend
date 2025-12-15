import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: false,
            message: "Token required",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as any;

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: "Invalid token",
        });
    }
};
