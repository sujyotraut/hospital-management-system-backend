import express from "express";
import { addWard, deleteWard, deleteWards, getWard, getWards, updateWard } from "../controllers/ward.controllers";
import checkAdmin from "../middleware/check-admin.middleware";

const wardRouter = express.Router();

wardRouter.get("/", getWards);
wardRouter.get("/:id", getWard);
wardRouter.post("/", checkAdmin, addWard);
wardRouter.put("/:id", checkAdmin, updateWard);
wardRouter.delete("/:id", deleteWard);
wardRouter.delete("/", deleteWards);

export default wardRouter;
