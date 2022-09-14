import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import APIResponse from "../types/api-response";
import { InvalidError } from "../utils/error.utils";
import { extractPatientData, extractUserData } from "../utils/extract-data.utils";
import { sanitizeUser } from "../utils/sanitize.utils";

const prisma = new PrismaClient();

// Get current user
export const me: RequestHandler = async (req, res) => {
  res.json({ status: "success", data: { me: sanitizeUser(res.locals.user) } } as APIResponse);
};

// Login user (get accessToken)
export const login: RequestHandler = async (req, res, next) => {
  // Extract username & password from request body
  const { username, password } = req.body;

  // If username or password is not defined throw error
  if (!username || !password) throw new InvalidError("Invalid username or password");

  // Check if user exist
  const userOrNull = await prisma.user.findUnique({ where: { username } });

  // If user doesn't exist or password doesn't match throw error
  if (!userOrNull || userOrNull.password !== password) throw new InvalidError("Invalid username or password");

  // Generate jsonwebtoken for user
  const accessToken = jwt.sign({ userId: userOrNull.id }, process.env.JWT_SECRET!);

  res.json({ status: "success", data: { accessToken } } as APIResponse);
};

// Register admin (get accessToken)
export const registerAdmin: RequestHandler = async (req, res, next) => {
  // Extract user/admin fields form request body
  const userData = extractUserData(req);

  // Create admin user
  const user = await prisma.user.create({ data: { ...userData, role: "admin" } });

  // Generate jsonwebtoken for registered user
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

  res.json({ status: "success", data: { accessToken } } as APIResponse);
};

// Register patient (get accessToken)
export const registerPatient: RequestHandler = async (req, res, next) => {
  // Extract user/patient fields form request body
  const userData = extractUserData(req);
  const patientData = extractPatientData(req);

  // Create user/patient
  const user = await prisma.user.create({ data: { ...userData, role: "patient", patient: { create: patientData } } });

  // Generate jsonwebtoken for registered patient
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

  res.json({ status: "success", data: { accessToken } } as APIResponse);
};

// Get users
export const getUsers: RequestHandler = async (req, res) => {
  const total = await prisma.user.count();
  let users = await prisma.user.findMany();
  users = users.map((user) => sanitizeUser(user));
  res.json({ status: "success", data: { users, total } } as APIResponse);
};

// Update user
export const updateUser: RequestHandler = async (req, res, next) => {
  // Retrieve user data form request body
  const userData = extractUserData(req);

  const user = await prisma.user.update({ where: { id: req.params.id }, data: userData });

  res.json({ status: "success", data: { user } } as APIResponse);
};

// Delete user with id
export const deleteUser: RequestHandler = async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ status: "success", data: {} } as APIResponse);
};

// Delete users with ids
export const deleteUsers: RequestHandler = async (req, res, next) => {
  // Get ids field from query
  const rawIds = req.query.ids;

  // If there is not ids field in query then delete all users
  if (!rawIds) return deleteAllUsers(req, res, next);

  // Convert ids separated by comma (,) to array of ids
  const ids = rawIds.toString().split(",");

  // Delete users whose id's are in ids array
  const { count } = await prisma.user.deleteMany({ where: { id: { in: ids } } });

  return res.json({ status: "success", data: { deleted: count } });
};

// Delete all users
export const deleteAllUsers: RequestHandler = async (req, res, next) => {
  const { count } = await prisma.user.deleteMany();
  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};
