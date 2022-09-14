import { Request } from 'express';

const getPagination = (req: Request) => {
  const _page = req.query._page || '';
  const _limit = req.query._limit || '';
  const page = parseInt(_page.toString()) || 1;
  const limit = parseInt(_limit.toString()) || 10;
  return { page, limit };
};

export const getSkip = (req: Request) => {
  const { page, limit } = getPagination(req);
  return (page - 1) * limit;
};

export const getTake = (req: Request) => {
  return getPagination(req).limit;
};
