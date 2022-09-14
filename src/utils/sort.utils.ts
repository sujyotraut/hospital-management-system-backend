import { Bed, Doctor, Insurance, Medicine, Patient, Prisma, Room, Staff, User, Ward } from "@prisma/client";
import { Request } from "express";

//#region Sort Fields
type OmitUserFields = "password" | "role";
export const userSortFields: Omit<User, OmitUserFields> = {
  id: "",
  firstName: "",
  lastName: "",
  username: "",
  dateOfBirth: "",
  contact: "",
  email: "",
};

export const doctorSortFields: Doctor = {
  id: "",
  experience: "",
  qualifications: "",
  specialization: "",
};

export const staffSortFields: Staff = {
  id: "",
  experience: "",
  qualifications: "",
};

export const patientSortFields: Patient = {
  id: "",
  city: "",
  address: "",
};

export const wardSortFields: Ward = {
  id: "",
  name: "",
  description: "",
};

type OmitRoomFields = "wardId";
export const roomSortFields: Omit<Room, OmitRoomFields> = {
  id: "",
  roomNo: "",
  description: "",
};

type OmitBedFields = "roomId";
export const bedSortFields: Omit<Bed, OmitBedFields> = {
  id: "",
  bedNo: "",
  description: "",
};

export const medicineSortFields: Medicine = {
  id: "",
  name: "",
  companyName: "",
  description: "",
  status: "",
  price: 0,
};

export const insuranceSortFields: Insurance = {
  id: "",
  name: "",
  companyName: "",
  patientName: "",
  endDate: "",
  amount: 0,
};
//#endregion

export const getSort = (req: Request) => {
  const sort = req.query._sort?.toString() || "id";
  let order = req.query._order?.toString() || "asc";
  order = ["asc", "desc"].includes(order) ? order : "asc";
  return { sort, order };
};

export const getDoctorSort = (req: Request): Prisma.UserOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  const isSortValidForUser = Object.keys(userSortFields).includes(sort);
  const isSortValidForDoctor = Object.keys(doctorSortFields).includes(sort);
  sort = isSortValidForUser || isSortValidForDoctor ? sort : "id";
  if (isSortValidForUser) return { [sort]: order };
  else return { doctor: { [sort]: order } };
};

export const getStaffSort = (req: Request): Prisma.UserOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  const isSortValidForUser = Object.keys(userSortFields).includes(sort);
  const isSortValidForStaff = Object.keys(staffSortFields).includes(sort);
  sort = isSortValidForUser || isSortValidForStaff ? sort : "id";
  if (isSortValidForUser) return { [sort]: order };
  else return { staff: { [sort]: order } };
};

export const getPatientSort = (req: Request): Prisma.UserOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  const isSortValidForUser = Object.keys(userSortFields).includes(sort);
  const isSortValidForPatient = Object.keys(patientSortFields).includes(sort);
  sort = isSortValidForUser || isSortValidForPatient ? sort : "id";
  if (isSortValidForUser) return { [sort]: order };
  else return { patient: { [sort]: order } };
};

export const getWardSort = (req: Request): Prisma.WardOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  sort = Object.keys(wardSortFields).includes(sort) ? sort : "id";
  return { [sort]: order };
};

export const getRoomSort = (req: Request): Prisma.RoomOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  const isSortValidForRoom = Object.keys(roomSortFields).includes(sort);
  const isSortValidForWard = Object.keys(wardSortFields).includes(sort);
  sort = isSortValidForRoom || isSortValidForWard ? sort : "id";
  if (isSortValidForRoom) return { [sort]: order };
  else return { ward: { [sort]: order } };
};

export const getBedSort = (req: Request): Prisma.BedOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  const isSortValidForBed = Object.keys(bedSortFields).includes(sort);
  const isSortValidForRoom = Object.keys(roomSortFields).includes(sort);
  sort = isSortValidForBed || isSortValidForRoom ? sort : "id";
  if (isSortValidForBed) return { [sort]: order };
  else return { room: { [sort]: order } };
};

export const getMedicineSort = (req: Request): Prisma.MedicineOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  sort = Object.keys(medicineSortFields).includes(sort) ? sort : "id";
  return { [sort]: order };
};

export const getInsuranceSort = (req: Request): Prisma.InsuranceOrderByWithRelationInput => {
  let { sort, order } = getSort(req);
  sort = Object.keys(insuranceSortFields).includes(sort) ? sort : "id";
  return { [sort]: order };
};
