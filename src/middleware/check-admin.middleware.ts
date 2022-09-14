import { RequestHandler } from "express";
import { ForbiddenError } from "../utils/error.utils";

const checkAdmin: RequestHandler = async (req, res, next) => {
  if (res.locals.user.role !== "admin") throw new ForbiddenError();
  next();
};

export default checkAdmin;
