import { Doctor, PrismaClient, User } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractDoctorData, extractUserData } from "../utils/extract-data.utils";
import { getDoctorFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { sanitizeUser } from "../utils/sanitize.utils";
import { getDoctorSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

// Get doctors
export const getDoctors: RequestHandler = async (req, res) => {
  // Get users where role is doctor with given sort, filter & pagination
  const users = await prisma.user.findMany({
    include: { doctor: true },
    where: getDoctorFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getDoctorSort(req),
  });

  // Convert retrieved users/doctors to appropriate response format
  const doctors = users.map(({ doctor, ...other }) => ({ ...doctor, ...sanitizeUser(other) }));

  res.json({ status: "success", data: { doctors, total: await prisma.doctor.count() } } as APIResponse);
};

// Get doctor
export const getDoctor: RequestHandler = async (req, res, next) => {
  // Try to get user/doctor with given id
  const userOrNull = await prisma.user.findUnique({ where: { id: req.params.id }, include: { doctor: true } });

  // If user/doctor doesn't exist then throw not found error
  if (!userOrNull || userOrNull.role !== "doctor") throw new NotFoundError();

  // Convert user/doctor to appropriate response format
  const { doctor, ...other } = userOrNull as User & { doctor: Doctor };

  res.json({ status: "success", data: { doctor: { ...doctor, ...sanitizeUser(other) } } } as APIResponse);
};

// Add doctor
export const addDoctor: RequestHandler = async (req, res, next) => {
  const userData = extractUserData(req);
  const doctorData = extractDoctorData(req);

  const { doctor, ...user } = await prisma.user.create({
    include: { doctor: true },
    data: {
      ...userData,
      role: "doctor",
      doctor: { create: doctorData },
    },
  });

  res.json({ status: "success", data: { doctor: { ...doctor, ...sanitizeUser(user) } } } as APIResponse);
};

// Update doctor
export const updateDoctor: RequestHandler = async (req, res, next) => {
  const userData = extractUserData(req);
  const doctorData = extractDoctorData(req);

  const { doctor, ...user } = await prisma.user.update({
    include: { doctor: true },
    where: { id: req.params.id },
    data: { ...userData, doctor: { update: doctorData } },
  });

  res.json({ status: "success", data: { doctor: { ...doctor, ...sanitizeUser(user) } } } as APIResponse);
};
