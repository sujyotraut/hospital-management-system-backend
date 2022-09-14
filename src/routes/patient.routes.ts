import express from "express";
import { addPatient, getPatient, getPatients, updatePatient } from "../controllers/patient.controllers";
import checkAdmin from "../middleware/check-admin.middleware";

const patientRouter = express.Router();

patientRouter.get("/", getPatients);
patientRouter.get("/:id", getPatient);
patientRouter.post("/", checkAdmin, addPatient);
patientRouter.put("/:id", checkAdmin, updatePatient);

export default patientRouter;
