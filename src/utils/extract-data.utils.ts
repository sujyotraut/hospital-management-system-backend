import { Bed, Doctor, Insurance, Medicine, Patient, Room, Staff, User, Ward } from "@prisma/client";
import { Request } from "express";

//#region Data Fields
type OmitUserFields = "id" | "role";
const userDataFields: Omit<User, OmitUserFields> = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  dateOfBirth: "",
  contact: "",
  email: "",
};

type OmitDoctorFields = "id";
const doctorDataFields: Omit<Doctor, OmitDoctorFields> = {
  experience: "",
  qualifications: "",
  specialization: "",
};

type OmitStaffFields = "id";
const staffDataFields: Omit<Staff, OmitStaffFields> = {
  experience: "",
  qualifications: "",
};

type OmitPatientFields = "id";
const patientDataFields: Omit<Patient, OmitPatientFields> = {
  city: "",
  address: "",
};

type OmitWardFields = "id";
const wardDataFields: Omit<Ward, OmitWardFields> = {
  name: "",
  description: "",
};

type OmitRoomFields = "id" | "wardId";
const roomDataFields: Omit<Room, OmitRoomFields> = {
  roomNo: "",
  description: "",
};

type OmitBedFields = "id" | "roomId";
const bedDataFields: Omit<Bed, OmitBedFields> = {
  bedNo: "",
  description: "",
};

type OmitMedicineFields = "id";
const medicineDataFields: Omit<Medicine, OmitMedicineFields> = {
  name: "",
  companyName: "",
  description: "",
  price: 0,
  status: "",
};

type OmitInsuranceFields = "id" | "roomId";
const insuranceDataFields: Omit<Insurance, OmitInsuranceFields> = {
  name: "",
  companyName: "",
  patientName: "",
  amount: 0,
  endDate: "",
};
//#endregion

const extractData = (data: any, defaultDataFields: object) => {
  let _data: any = {};
  for (const key in defaultDataFields) _data[key] = data[key];
  return _data;
};

export const extractUserData = (req: Request): typeof userDataFields => extractData(req.body, userDataFields);

export const extractDoctorData = (req: Request): typeof doctorDataFields => extractData(req.body, doctorDataFields);

export const extractStaffData = (req: Request): typeof staffDataFields => extractData(req.body, staffDataFields);

export const extractPatientData = (req: Request): typeof patientDataFields => extractData(req.body, patientDataFields);

export const extractWardData = (req: Request): typeof wardDataFields => extractData(req.body, wardDataFields);

export const extractRoomData = (req: Request): typeof roomDataFields => extractData(req.body, roomDataFields);

export const extractBedData = (req: Request): typeof bedDataFields => extractData(req.body, bedDataFields);

export const extractMedicineData = (req: Request): typeof medicineDataFields =>
  extractData(req.body, medicineDataFields);

export const extractInsuranceData = (req: Request): typeof insuranceDataFields =>
  extractData(req.body, insuranceDataFields);
