import { Router } from "express";
import Response from "../models/responsesModel";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const r = await Response.create(req.body);
    res.json(r);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/:formId", async (req, res) => {
  try {
    const list = await Response.find({ formId: req.params.formId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default router;
