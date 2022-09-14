import { Patient, PrismaClient, User } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractPatientData, extractUserData } from "../utils/extract-data.utils";
import { getPatientFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { sanitizeUser } from "../utils/sanitize.utils";
import { getPatientSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

// Get patients
export const getPatients: RequestHandler = async (req, res) => {
  // Get users where role is patient with given sort, filter & pagination
  const users = await prisma.user.findMany({
    include: { patient: true },
    where: getPatientFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getPatientSort(req),
  });

  // Convert retrieved users/patients to appropriate response format
  const patients = users.map(({ patient, ...other }) => ({ ...patient, ...sanitizeUser(other) }));

  res.json({ status: "success", data: { patients, total: await prisma.patient.count() } } as APIResponse);
};

// Get patient
export const getPatient: RequestHandler = async (req, res, next) => {
  // Try to get user/patient with given id
  const userOrNull = await prisma.user.findUnique({ where: { id: req.params.id }, include: { patient: true } });

  // If user/patient doesn't exist then throw not found error
  if (!userOrNull || userOrNull.role !== "patient") throw new NotFoundError();

  // Convert user/patient to appropriate response format
  const { patient, ...other } = userOrNull as User & { patient: Patient };

  res.json({ status: "success", data: { patient: { ...patient, ...sanitizeUser(other) } } } as APIResponse);
};

// Add patient
export const addPatient: RequestHandler = async (req, res, next) => {
  const userData = extractUserData(req);
  const patientData = extractPatientData(req);

  const { patient, ...user } = await prisma.user.create({
    include: { patient: true },
    data: {
      ...userData,
      role: "patient",
      patient: { create: patientData },
    },
  });

  res.json({ status: "success", data: { patient: { ...patient, ...sanitizeUser(user) } } } as APIResponse);
};

// Update patient
export const updatePatient: RequestHandler = async (req, res, next) => {
  const userData = extractUserData(req);
  const patientData = extractPatientData(req);

  const { patient, ...user } = await prisma.user.update({
    include: { patient: true },
    where: { id: req.params.id },
    data: { ...userData, patient: { update: patientData } },
  });

  res.json({ status: "success", data: { patient: { ...patient, ...sanitizeUser(user) } } } as APIResponse);
};
