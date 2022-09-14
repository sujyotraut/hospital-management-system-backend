import express from "express";
import {
  deleteUser,
  deleteUsers,
  getUsers,
  login,
  me,
  registerAdmin,
  registerPatient,
  updateUser,
} from "../controllers/user.controllers";
import authRequire from "../middleware/auth-require.middleware";
import checkAdmin from "../middleware/check-admin.middleware";

const userRouter = express.Router();

userRouter.get("/me", authRequire, me);
userRouter.get("/", authRequire, checkAdmin, getUsers);
userRouter.post("/login", login);
userRouter.post("/register-admin", registerAdmin);
userRouter.post("/register-patient", registerPatient);
userRouter.put("/:id", authRequire, checkAdmin, updateUser);
userRouter.delete("/:id", authRequire, checkAdmin, deleteUser);
userRouter.delete("/", authRequire, checkAdmin, deleteUsers);

export default userRouter;
