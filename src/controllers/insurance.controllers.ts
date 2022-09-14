import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractInsuranceData } from "../utils/extract-data.utils";
import { getInsuranceFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { getInsuranceSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

export const getAllInsurance: RequestHandler = async (req, res) => {
  const insurances = await prisma.insurance.findMany({
    where: getInsuranceFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getInsuranceSort(req),
  });

  res.json({ status: "success", data: { insurances, total: await prisma.insurance.count() } } as APIResponse);
};

export const getInsurance: RequestHandler = async (req, res) => {
  // Try to get insurance with given id
  const insuranceOrNull = await prisma.insurance.findUnique({ where: { id: req.params.id } });

  // If insurance doesn't exist then throw not found error
  if (!insuranceOrNull) throw new NotFoundError();

  res.json({ status: "success", data: { insurance: insuranceOrNull } } as APIResponse);
};

export const addInsurance: RequestHandler = async (req, res) => {
  const insuranceData = extractInsuranceData(req);
  const insurance = await prisma.insurance.create({ data: insuranceData });
  res.json({ status: "success", data: { insurance } } as APIResponse);
};

export const updateInsurance: RequestHandler = async (req, res) => {
  const insuranceData = extractInsuranceData(req);
  const insurance = await prisma.insurance.update({ where: { id: req.params.id }, data: insuranceData });
  res.json({ status: "success", data: { insurance } } as APIResponse);
};

export const deleteInsurance: RequestHandler = async (req, res) => {
  await prisma.insurance.delete({ where: { id: req.params.id } });
  res.json({ status: "success", data: {} } as APIResponse);
};

export const deleteInsurances: RequestHandler = async (req, res, next) => {
  // Get ids field from query
  const rawIds = req.query.ids;

  // If there is not ids field in query then delete all insurances
  if (!rawIds) return deleteAllInsurances(req, res, next);

  // Convert ids separated by comma (,) to array of ids
  const ids = rawIds.toString().split(",");

  // Delete insurances whose id's are in ids array
  const { count } = await prisma.insurance.deleteMany({ where: { id: { in: ids } } });

  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};

export const deleteAllInsurances: RequestHandler = async (req, res) => {
  const { count } = await prisma.insurance.deleteMany();
  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};
