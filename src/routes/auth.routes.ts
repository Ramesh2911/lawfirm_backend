import { Router } from "express";
import {
clientRegister,
clientLogin
}
    from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", clientRegister);
authRouter.post("/login", clientLogin);

export default authRouter;
