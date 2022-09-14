import express from "express";
import { addDoctor, getDoctor, getDoctors, updateDoctor } from "../controllers/doctor.controllers";
import checkAdmin from "../middleware/check-admin.middleware";

const doctorRouter = express.Router();

doctorRouter.get("/", getDoctors);
doctorRouter.get("/:id", getDoctor);
doctorRouter.post("/", checkAdmin, addDoctor);
doctorRouter.put("/:id", checkAdmin, updateDoctor);

export default doctorRouter;
