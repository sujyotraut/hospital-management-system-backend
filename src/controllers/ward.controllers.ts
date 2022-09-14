import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractWardData } from "../utils/extract-data.utils";
import { getWardFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { getWardSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

export const getWards: RequestHandler = async (req, res) => {
  const wards = await prisma.ward.findMany({
    where: getWardFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getWardSort(req),
  });

  res.json({ status: "success", data: { wards, total: await prisma.ward.count() } } as APIResponse);
};

export const getWard: RequestHandler = async (req, res) => {
  // Try to get ward with given id
  const wardOrNull = await prisma.ward.findUnique({ where: { id: req.params.id } });

  // If ward doesn't exist then throw not found error
  if (!wardOrNull) throw new NotFoundError();

  res.json({ status: "success", data: { ward: wardOrNull } } as APIResponse);
};

export const addWard: RequestHandler = async (req, res) => {
  const wardData = extractWardData(req);
  const ward = await prisma.ward.create({ data: wardData });
  res.json({ status: "success", data: { ward } } as APIResponse);
};

export const updateWard: RequestHandler = async (req, res) => {
  const wardData = extractWardData(req);
  const ward = await prisma.ward.update({ where: { id: req.params.id }, data: wardData });
  res.json({ status: "success", data: { ward } } as APIResponse);
};

export const deleteWard: RequestHandler = async (req, res) => {
  await prisma.ward.delete({ where: { id: req.params.id } });
  res.json({ status: "success", data: {} } as APIResponse);
};

export const deleteWards: RequestHandler = async (req, res, next) => {
  // Get ids field from query
  const rawIds = req.query.ids;

  // If there is not ids field in query then delete all wards
  if (!rawIds) return deleteAllWards(req, res, next);

  // Convert ids separated by comma (,) to array of ids
  const ids = rawIds.toString().split(",");

  // Delete wards whose id's are in ids array
  const { count } = await prisma.ward.deleteMany({ where: { id: { in: ids } } });

  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};

export const deleteAllWards: RequestHandler = async (req, res) => {
  const { count } = await prisma.ward.deleteMany();
  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};
