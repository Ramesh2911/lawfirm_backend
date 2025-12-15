import { Router } from "express";
import {
    createCase,
    getClientCases,
    getAllCases
}
    from "../controllers/case.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const caseRouter = Router();

caseRouter.post("/create-case", verifyToken, createCase);
caseRouter.get("/case-list", verifyToken, getClientCases);
caseRouter.get("/case-all-list", verifyToken, getAllCases);

export default caseRouter;
