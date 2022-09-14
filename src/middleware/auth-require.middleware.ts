import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../utils/error.utils";

const prisma = new PrismaClient();

const authRequired: RequestHandler = async (req, res, next) => {
  // Check for jsonwebtoken in authorization header
  const accessToken = req.headers["authorization"]?.split(" ")[1] || "";

  // If no token is found, response unauthorized
  if (!accessToken) throw new UnauthorizedError();

  try {
    // Verify token & try to retrieve user for that token
    const token = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: token.userId } });

    // If no user found response unauthorized
    if (!user) throw new UnauthorizedError();

    // If user is found, assign it to response locals object
    res.locals.user = user;
  } catch (error) {
    // token verification failed, response unauthorized
    throw new UnauthorizedError();
  }

  next();
};

export default authRequired;
