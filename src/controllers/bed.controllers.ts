import { Bed, PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractBedData, extractRoomData } from "../utils/extract-data.utils";
import { getBedFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { getBedSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

export const getBeds: RequestHandler = async (req, res) => {
  const bedsData = await prisma.bed.findMany({
    include: { room: true },
    where: getBedFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getBedSort(req),
  });

  // Convert retrieved beds to appropriate response format
  const beds = bedsData.map(({ room, ...bed }) => ({ ...bed, roomNo: room.roomNo }));

  res.json({ status: "success", data: { beds, total: await prisma.bed.count() } } as APIResponse);
};

export const getBed: RequestHandler = async (req, res) => {
  const bedOrNull = await prisma.bed.findUnique({ where: { id: req.params.id }, include: { room: true } });
  if (!bedOrNull) throw new NotFoundError();
  const { room, ...bed } = bedOrNull;
  res.json({ status: "success", data: { bed: { ...bed, roomNo: room.roomNo } } } as APIResponse);
};

export const addBed: RequestHandler = async (req, res) => {
  const bedData = extractBedData(req);
  const roomData = extractRoomData(req);

  const { room, ...bed } = await prisma.bed.create({
    include: { room: true },
    data: {
      ...bedData,
      room: { connect: { roomNo: roomData.roomNo } },
    },
  });

  res.json({ status: "success", data: { bed: { ...bed, roomNo: room.roomNo } } } as APIResponse);
};

export const updateBed: RequestHandler = async (req, res) => {
  const { id, roomId, roomNo, ...other }: Bed & { roomNo: string } = req.body;
  const { room, ...bed } = await prisma.bed.update({
    include: { room: true },
    where: { id: req.params.id },
    data: { ...other, room: { connect: { roomNo } } },
  });

  res.json({ status: "success", data: { bed: { ...bed, roomNo: room.roomNo } } });
};

export const deleteBed: RequestHandler = async (req, res) => {
  await prisma.bed.delete({ where: { id: req.params.id } });
  res.json({ status: "success", data: {} } as APIResponse);
};

export const deleteBeds: RequestHandler = async (req, res, next) => {
  // Get ids field from query
  const rawIds = req.query.ids;

  // If there is not ids field in query then delete all beds
  if (!rawIds) return deleteAllBeds(req, res, next);

  // Convert ids separated by comma (,) to array of ids
  const ids = rawIds.toString().split(",");

  // Delete beds whose id's are in ids array
  const { count } = await prisma.bed.deleteMany({ where: { id: { in: ids } } });

  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};

export const deleteAllBeds: RequestHandler = async (req, res) => {
  const { count } = await prisma.bed.deleteMany();
  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};
