import express from "express";
import {
  addInsurance,
  deleteInsurance,
  deleteInsurances,
  getAllInsurance,
  getInsurance,
  updateInsurance,
} from "../controllers/insurance.controllers";

const insuranceRouter = express.Router();

insuranceRouter.get("/", getAllInsurance);
insuranceRouter.get("/:id", getInsurance);
insuranceRouter.post("/", addInsurance);
insuranceRouter.put("/:id", updateInsurance);
insuranceRouter.delete("/:id", deleteInsurance);
insuranceRouter.delete("/", deleteInsurances);

export default insuranceRouter;
