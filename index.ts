import { PrismaClient } from "@prisma/client";
import cores from "cors";
import express from "express";
import authRequire from "./src/middleware/auth-require.middleware";
import handleError from "./src/middleware/error-handler.middleware";
import bedRouter from "./src/routes/bed.routes";
import doctorRouter from "./src/routes/doctor.routes";
import insuranceRouter from "./src/routes/insurance.routes";
import medicineRouter from "./src/routes/medicine.routes";
import roomRouter from "./src/routes/room.routes";
import staffRouter from "./src/routes/staff.routes";
import userRouter from "./src/routes/user.routes";
import wardRouter from "./src/routes/ward.routes";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cores({ origin: "*" }));

// Routers
app.use("/users", userRouter);
app.use("/doctors", authRequire, doctorRouter);
app.use("/staff", authRequire, staffRouter);
app.use("/wards", authRequire, wardRouter);
app.use("/rooms", authRequire, roomRouter);
app.use("/beds", authRequire, bedRouter);
app.use("/medicines", authRequire, medicineRouter);
app.use("/insurance", authRequire, insuranceRouter);

//#region Experiment
// For experimental purpose (development only)
const prisma = new PrismaClient();
app.post("/test", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: "req.params.id" }, include: { doctor: true } });
  console.log(user);
  res.send("test");
});
//#endregion

// Error Handling
app.use(handleError);

app.get("/", (req, res) => res.send("Server is up & running!"));
app.listen(port, () => console.log(`http://localhost:${port}`));
