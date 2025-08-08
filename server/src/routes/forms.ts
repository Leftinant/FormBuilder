import express, { Request, Response } from "express";
import Form from "../models/Form";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ error: "Failed to create form" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedForm);
  } catch (err) {
    res.status(500).json({ error: "Failed to update form" });
  }
});

export default router;
