import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractMedicineData } from "../utils/extract-data.utils";
import { getMedicineFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { getMedicineSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

export const getMedicines: RequestHandler = async (req, res) => {
  const medicines = await prisma.medicine.findMany({
    where: getMedicineFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getMedicineSort(req),
  });

  res.json({ status: "success", data: { medicines, total: await prisma.medicine.count() } } as APIResponse);
};

export const getMedicine: RequestHandler = async (req, res) => {
  // Try to get medicine with given id
  const medicineOrNull = await prisma.medicine.findUnique({ where: { id: req.params.id } });

  // If medicine doesn't exist then throw not found error
  if (!medicineOrNull) throw new NotFoundError();

  res.json({ status: "success", data: { medicine: medicineOrNull } } as APIResponse);
};

export const addMedicine: RequestHandler = async (req, res) => {
  const medicineData = extractMedicineData(req);
  const medicine = await prisma.medicine.create({ data: medicineData });
  res.json({ status: "success", data: { medicine } } as APIResponse);
};

export const updateMedicine: RequestHandler = async (req, res) => {
  const medicineData = extractMedicineData(req);
  const medicine = await prisma.medicine.update({ where: { id: req.params.id }, data: medicineData });
  res.json({ status: "success", data: { medicine } } as APIResponse);
};

export const deleteMedicine: RequestHandler = async (req, res) => {
  await prisma.medicine.delete({ where: { id: req.params.id } });
  res.json({ status: "success", data: {} } as APIResponse);
};

export const deleteMedicines: RequestHandler = async (req, res, next) => {
  // Get ids field from query
  const rawIds = req.query.ids;

  // If there is not ids field in query then delete all medicines
  if (!rawIds) return deleteAllMedicines(req, res, next);

  // Convert ids separated by comma (,) to array of ids
  const ids = rawIds.toString().split(",");

  // Delete medicines whose id's are in ids array
  const { count } = await prisma.medicine.deleteMany({ where: { id: { in: ids } } });

  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};

export const deleteAllMedicines: RequestHandler = async (req, res) => {
  const { count } = await prisma.medicine.deleteMany();
  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};
