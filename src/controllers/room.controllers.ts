import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractRoomData, extractWardData } from "../utils/extract-data.utils";
import { getRoomFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { getRoomSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

export const getRooms: RequestHandler = async (req, res) => {
  const roomsData = await prisma.room.findMany({
    include: { ward: true },
    where: getRoomFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getRoomSort(req),
  });

  // Convert retrieved rooms to appropriate response format
  const rooms = roomsData.map(({ ward, ...room }) => ({ ...room, wardName: ward.name }));

  res.json({ status: "success", data: { rooms, total: await prisma.room.count() } } as APIResponse);
};

export const getRoom: RequestHandler = async (req, res) => {
  const roomOrNull = await prisma.room.findUnique({ where: { id: req.params.id }, include: { ward: true } });
  if (!roomOrNull) throw new NotFoundError();
  const { ward, ...room } = roomOrNull;
  res.json({ status: "success", data: { room: { ...room, wardName: ward.name } } } as APIResponse);
};

export const addRoom: RequestHandler = async (req, res) => {
  const roomData = extractRoomData(req);
  const wardData = extractWardData(req);

  const { ward, ...room } = await prisma.room.create({
    include: { ward: true },
    data: { ...roomData, ward: { connect: { id: wardData.name } } },
  });

  res.json({ status: "success", data: { room: { ...room, wardName: ward.name } } } as APIResponse);
};

export const updateRoom: RequestHandler = async (req, res) => {
  const roomData = extractRoomData(req);
  const wardData = extractWardData(req);

  const { ward, ...room } = await prisma.room.update({
    include: { ward: true },
    where: { id: req.params.id },
    data: { ...roomData, ward: { update: wardData } },
  });

  res.json({ status: "success", data: { room: { ...room, wardName: ward.name } } } as APIResponse);
};

export const deleteRoom: RequestHandler = async (req, res) => {
  await prisma.room.delete({ where: { id: req.params.id } });
  res.json({ status: "success", data: {} } as APIResponse);
};

export const deleteRooms: RequestHandler = async (req, res, next) => {
  // Get ids field from query
  const rawIds = req.query.ids;

  // If there is not ids field in query then delete all rooms
  if (!rawIds) return deleteAllRooms(req, res, next);

  // Convert ids separated by comma (,) to array of ids
  const ids = rawIds.toString().split(",");

  // Delete rooms whose id's are in ids array
  const { count } = await prisma.room.deleteMany({ where: { id: { in: ids } } });

  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};

export const deleteAllRooms: RequestHandler = async (req, res) => {
  const { count } = await prisma.room.deleteMany();
  res.json({ status: "success", data: { deleted: count } } as APIResponse);
};
