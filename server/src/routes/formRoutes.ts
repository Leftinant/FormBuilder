import { Router } from "express";
import Form from "../models/FormModel";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";

const router = Router();
const upload = multer();

router.post("/", async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/upload-image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "no file" });
    const stream = cloudinary.uploader.upload_stream(
      { folder: "form-builder" },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        res.json({ url: result?.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await Form.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const doc = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default router;
