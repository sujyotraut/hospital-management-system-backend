import { User } from "@prisma/client";

//#region Sanitize Fields
const userSanitizeFields: Partial<User> = {
  // role: "",
  password: "",
};
//#endregion

export const sanitizeUser = (user: User & { [key: string]: any }) => {
  for (const key in userSanitizeFields) delete user[key];
  return user;
};
