import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { ErrorRequestHandler } from "express";
import APIResponse from "../types/api-response";
import { BaseError } from "../utils/error.utils";

const msg_unknown_error = "An unexpected error occurred";
const handleError: ErrorRequestHandler = (err: Error, req, res, next) => {
  if (err instanceof PrismaClientKnownRequestError) {
    // console.log(`ERROR_NAME: ${err.name}, CODE: ${err.code}`);
    switch (err.code) {
      case "P2002":
        const field = (err.meta!.target as string[])[0];
        return res.json({ status: "fail", message: `Field '${field}' should be unique` } as APIResponse);
      case "P2025":
        const cause = err.meta!.cause as string;
        return res.json({ status: "fail", message: cause } as APIResponse);
      default:
        res.json({ status: "fail", message: err.code } as APIResponse);
    }
  } else if (err instanceof PrismaClientValidationError) {
    // Send fail response for require fields
    const regexRequireField = /(?<=data\.).+(?=\s+is\smissing)/g;
    const requireFields = regexRequireField.exec(err.message);
    if (requireFields) {
      return res.json({ status: "fail", message: `Field '${requireFields[0]}' is required` } as APIResponse);
    }

    // Send fail response for invalid fields
    const regexInvalidField = /(?<=Argument\s+).+(?=\.\n)/g;
    const invalidFields = regexInvalidField.exec(err.message);
    if (invalidFields) {
      const [fieldName, other] = invalidFields[0].split(":");
      const msg = `Invalid value for '${fieldName}': ${/Provided.+/.exec(other)![0].toLowerCase()}`;
      return res.json({ status: "fail", message: msg } as APIResponse);
    }

    // Send fail response for unknown fields
    const regexUnknownField = /(?<=Unknown\sarg\s\`).+(?=\`)/g;
    const unknownFields = regexUnknownField.exec(err.message);
    if (unknownFields) {
      return res.json({ status: "fail", message: `Field '${unknownFields[0]}' is unknown` } as APIResponse);
    }

    res.json({ status: "fail", message: "Invalid field or value" } as APIResponse);
  } else if (err instanceof BaseError) res.json({ status: "fail", message: err.message } as APIResponse);
  else res.json({ status: "error", message: msg_unknown_error } as APIResponse);
};

export default handleError;
