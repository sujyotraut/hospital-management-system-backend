import { Doctor, Patient, PrismaClient, Staff, User } from "@prisma/client";
import { Request } from "express";
import { InvalidError } from "./error.utils";

const prisma = new PrismaClient();

//#region Validate Fields
type OmitUserFields = "id" | "role";
const userValidateFields: Omit<User, OmitUserFields> = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  dateOfBirth: "",
  contact: "",
  email: "",
};

type OmitDoctorFields = "id";
const doctorValidateFields: Omit<Doctor, OmitDoctorFields> = {
  experience: "",
  qualifications: "",
  specialization: "",
};

type OmitStaffFields = "id";
const staffValidateFields: Omit<Staff, OmitStaffFields> = {
  experience: "",
  qualifications: "",
};

type OmitPatientFields = "id";
const patientValidateFields: Omit<Patient, OmitPatientFields> = {
  city: "",
  address: "",
};
//#endregion

export const validateLogin = async (req: Request): Promise<User | Error> => {
  const msg = "Invalid username or password";
  const { username, password } = req.body;
  if (!username || !password) return new InvalidError(msg);

  const userOrNull = await prisma.user.findUnique({ where: { username } });
  if (!userOrNull || userOrNull.password !== password) return new InvalidError(msg);

  return userOrNull;
};

export const validateUser = async (req: Request): Promise<typeof userValidateFields | Error> => {
  let user: any = {};
  for (const key in userValidateFields) {
    switch (key) {
      case "username":
        const userOrNull = await prisma.user.findUnique({ where: { username: req.body[key] } });
        if (userOrNull) return InvalidError.errAlreadyExist("User", key);
      default:
        const property = req.body[key];
        if (property) user[key] = property;
        else return InvalidError.errPropertyRequired("User", key);
    }
  }

  return user;
};

export const validateDoctor = async (req: Request): Promise<typeof doctorValidateFields | Error> => {
  let doctor: any = {};
  for (const key in doctorValidateFields) {
    switch (key) {
      default:
        const property = req.body[key];
        if (property) doctor[key] = property;
        else return InvalidError.errPropertyRequired("Doctor", key);
    }
  }

  return doctor;
};

export const validateStaff = async (req: Request): Promise<typeof staffValidateFields | Error> => {
  let staff: any = {};
  for (const key in staffValidateFields) {
    switch (key) {
      default:
        const property = req.body[key];
        if (property) staff[key] = property;
        else return InvalidError.errPropertyRequired("Staff", key);
    }
  }

  return staff;
};

export const validatePatient = async (req: Request): Promise<typeof patientValidateFields | Error> => {
  let patient: any = {};
  for (const key in patientValidateFields) {
    switch (key) {
      default:
        const property = req.body[key];
        if (property) patient[key] = property;
        else return InvalidError.errPropertyRequired("Patient", key);
    }
  }

  return patient;
};
