import express from "express";
import { addBed, deleteBed, deleteBeds, getBed, getBeds, updateBed } from "../controllers/bed.controllers";
import checkAdmin from "../middleware/check-admin.middleware";

const bedRouter = express.Router();

bedRouter.get("/", getBeds);
bedRouter.get("/:id", getBed);
bedRouter.post("/", checkAdmin, addBed);
bedRouter.put("/:id", checkAdmin, updateBed);
bedRouter.delete("/:id", deleteBed);
bedRouter.delete("/", deleteBeds);

export default bedRouter;
