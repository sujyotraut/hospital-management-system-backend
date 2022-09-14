import express from "express";
import { addStaff, getAllStaff, getStaff, updateStaff } from "../controllers/staff.controllers";
import checkAdmin from "../middleware/check-admin.middleware";

const staffRouter = express.Router();

staffRouter.get("/", getAllStaff);
staffRouter.get("/:id", getStaff);
staffRouter.post("/", checkAdmin, addStaff);
staffRouter.put("/:id", checkAdmin, updateStaff);

export default staffRouter;
