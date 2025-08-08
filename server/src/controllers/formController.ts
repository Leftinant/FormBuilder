import { Request, Response } from "express";
import Form from "../models/FormModel";

export const createForm = async (req: Request, res: Response) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch {
    res.status(500).json({ error: "Failed to create form" });
  }
};

export const getForm = async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  } catch {
    res.status(500).json({ error: "Failed to fetch form" });
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    form.responses?.push(req.body);
    await form.save();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Submission failed" });
  }
};
