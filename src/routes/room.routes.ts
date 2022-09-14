import express from "express";
import { addRoom, deleteRoom, deleteRooms, getRoom, getRooms, updateRoom } from "../controllers/room.controllers";
import checkAdmin from "../middleware/check-admin.middleware";

const roomRouter = express.Router();

roomRouter.get("/", getRooms);
roomRouter.get("/:id", getRoom);
roomRouter.post("/", checkAdmin, addRoom);
roomRouter.put("/:id", checkAdmin, updateRoom);
roomRouter.delete("/:id", deleteRoom);
roomRouter.delete("/", deleteRooms);

export default roomRouter;
