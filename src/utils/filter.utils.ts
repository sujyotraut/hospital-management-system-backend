import { Bed, Doctor, Insurance, Medicine, Patient, Prisma, Room, Staff, User, Ward } from "@prisma/client";
import { Request } from "express";

//#region Filter Fields
type OmitUserFields = "id" | "password" | "role";
export const userFilterFields: Omit<User, OmitUserFields> = {
  firstName: "",
  lastName: "",
  username: "",
  dateOfBirth: "",
  contact: "",
  email: "",
};

type OmitDoctorFields = "id";
export const doctorFilterFields: Omit<Doctor, OmitDoctorFields> = {
  experience: "",
  qualifications: "",
  specialization: "",
};

type OmitStaffFields = "id";
export const staffFilterFields: Omit<Staff, OmitStaffFields> = {
  experience: "",
  qualifications: "",
};

type OmitPatientFields = "id";
export const patientFilterFields: Omit<Patient, OmitPatientFields> = {
  city: "",
  address: "",
};

type OmitWardFields = "id";
export const wardFilterFields: Omit<Ward, OmitWardFields> = {
  name: "",
  description: "",
};

type OmitRoomFields = "id" | "wardId";
export const roomFilterFields: Omit<Room, OmitRoomFields> = {
  roomNo: "",
  description: "",
};

type OmitBedFields = "id" | "roomId";
export const bedFilterFields: Omit<Bed, OmitBedFields> = {
  bedNo: "",
  description: "",
};

type OmitMedicineFields = "id";
export const medicineFilterFields: Omit<Medicine, OmitMedicineFields> = {
  name: "",
  companyName: "",
  description: "",
  status: "",
  price: 0,
};

type OmitInsuranceFields = "id";
export const insuranceFilterFields: Omit<Insurance, OmitInsuranceFields> = {
  name: "",
  companyName: "",
  patientName: "",
  endDate: "",
  amount: 0,
};
//#endregion

//#region Helper Functions
const convertToAppropriateType = (value: any, type: string) => {
  switch (type) {
    case "number":
      return { equals: parseFloat(value) || 0 };
    default:
      return { contains: value };
  }
};

const defineFilters = (defaultFilterObject: any, req: Request) => {
  const filters: any = {};
  for (const key in defaultFilterObject)
    filters[key] = convertToAppropriateType(req.query[key], typeof defaultFilterObject[key]);
  return filters;
};
//#endregion

export const getUserFilter = (req: Request): Prisma.UserWhereInput => {
  return defineFilters(userFilterFields, req);
};

export const getDoctorFilter = (req: Request): Prisma.UserWhereInput => {
  return {
    role: "doctor",
    ...getUserFilter(req),
    doctor: defineFilters(doctorFilterFields, req),
  };
};

export const getStaffFilter = (req: Request): Prisma.UserWhereInput => {
  return {
    role: "staff",
    ...getUserFilter(req),
    staff: defineFilters(staffFilterFields, req),
  };
};

export const getPatientFilter = (req: Request): Prisma.UserWhereInput => {
  return {
    role: "patient",
    ...getUserFilter(req),
    patient: defineFilters(patientFilterFields, req),
  };
};

export const getWardFilter = (req: Request): Prisma.WardWhereInput => {
  return defineFilters(wardFilterFields, req);
};

export const getRoomFilter = (req: Request): Prisma.RoomWhereInput => {
  return {
    ...defineFilters(roomFilterFields, req),
    ward: getWardFilter(req),
  };
};

export const getBedFilter = (req: Request): Prisma.BedWhereInput => {
  return {
    ...defineFilters(bedFilterFields, req),
    room: getRoomFilter(req),
  };
};

export const getMedicineFilter = (req: Request): Prisma.MedicineWhereInput => {
  return defineFilters(medicineFilterFields, req);
};

export const getInsuranceFilter = (req: Request): Prisma.InsuranceWhereInput => {
  return defineFilters(insuranceFilterFields, req);
};
