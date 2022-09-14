import { PrismaClient, Staff, User } from "@prisma/client";
import { RequestHandler } from "express";
import APIResponse from "../types/api-response";
import { NotFoundError } from "../utils/error.utils";
import { extractStaffData, extractUserData } from "../utils/extract-data.utils";
import { getStaffFilter } from "../utils/filter.utils";
import { getSkip, getTake } from "../utils/pagination.utils";
import { sanitizeUser } from "../utils/sanitize.utils";
import { getStaffSort } from "../utils/sort.utils";

const prisma = new PrismaClient();

export const getAllStaff: RequestHandler = async (req, res) => {
  // Get users where role is staff with given sort, filter & pagination
  const users = await prisma.user.findMany({
    include: { staff: true },
    where: getStaffFilter(req),
    skip: getSkip(req),
    take: getTake(req),
    orderBy: getStaffSort(req),
  });

  // Convert retrieved users/staff to appropriate response format
  const staff = users.map(({ staff, ...other }) => ({ ...staff, ...sanitizeUser(other) }));

  res.json({ status: "success", data: { staff, total: await prisma.staff.count() } } as APIResponse);
};

export const getStaff: RequestHandler = async (req, res, next) => {
  // Try to get user/staff with given id
  const userOrNull = await prisma.user.findUnique({ where: { id: req.params.id }, include: { staff: true } });

  // If user/staff doesn't exist then throw not found error
  if (!userOrNull || userOrNull.role !== "staff") throw new NotFoundError();

  // Convert user/staff to appropriate response format
  const { staff, ...other } = userOrNull as User & { staff: Staff };

  res.json({ status: "success", data: { staff: { ...staff, ...sanitizeUser(other) } } } as APIResponse);
};

export const addStaff: RequestHandler = async (req, res) => {
  const userData = extractUserData(req);
  const staffData = extractStaffData(req);

  const { staff, ...user } = await prisma.user.create({
    include: { staff: true },
    data: {
      ...userData,
      role: "staff",
      staff: { create: staffData },
    },
  });

  res.json({ status: "success", data: { staff: { ...staff, ...sanitizeUser(user) } } } as APIResponse);
};

export const updateStaff: RequestHandler = async (req, res) => {
  const userData = extractUserData(req);
  const staffData = extractStaffData(req);

  const { staff, ...user } = await prisma.user.update({
    include: { staff: true },
    where: { id: req.params.id },
    data: { ...userData, staff: { update: staffData } },
  });

  res.json({ status: "success", data: { staff: { ...staff, ...sanitizeUser(user) } } } as APIResponse);
};
