import { Response } from "express";
import CaseModel from "../models/case.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// Create Case
export const createCase = async (req: AuthRequest, res: Response) => {
    try {
        const client_id = req.user?.id;

        if (!client_id) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }

        const {
            case_name,
            description,
            price,
            preferred_contact,
            contact_value,
        } = req.body;

        if (!case_name || !description || !price || !preferred_contact || !contact_value) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        const result: any = await CaseModel.createCase({
            client_id,
            case_name,
            description,
            price: Number(price),
            preferred_contact: preferred_contact,
            contact_value: contact_value,
        });

        return res.status(200).json({
            status: true,
            message: "Case created successfully",
            case_id: result.insertId,
        });
    } catch (error) {
        console.error("Create Case Error:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

//All Case
export const getAllCases = async (req: AuthRequest, res: Response) => {
  try {
    const cases = (await CaseModel.getAllCases()) as any[];

    if (!cases || cases.length === 0) {
      return res.status(200).json({ status: true, message: "No case found", data: [] });
    }

    return res.status(200).json({ status: true, message: "Cases fetched successfully", data: cases });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error", data: [] });
  }
};

//case list by Client Id
export const getClientCases = async (req: AuthRequest, res: Response) => {
  try {
    const client_id = req.user?.id;

    if (!client_id) {
      return res.status(401).json({ status: false, message: "Unauthorized", data: [] });
    }

    const cases = (await CaseModel.getCasesByClient(client_id)) as any[];

    if (!cases || cases.length === 0) {
      return res.status(200).json({ status: true, message: "No case found", data: [] });
    }

    return res.status(200).json({ status: true, message: "Cases fetched successfully", data: cases });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error", data: [] });
  }
};
