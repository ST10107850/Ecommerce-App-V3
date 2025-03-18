import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../constants/http.codes";
import HttpError from "../utils/HttpError";
import { ZodError } from "zod";
import { NODE_ENV } from "../constants/env.const";
import { Request, Response, NextFunction } from "express";

interface ZodIssue {
  path: string[];
  message: string;
}

interface ZodErrorResponse {
  statusCode: number;
  body: {
    error: ZodIssue[];
    message: string;
  };
}

const handleZodError = (err: ZodError): ZodErrorResponse => {
  const error = err.issues.map((issue) => ({
    path: issue.path.map((p) => String(p)),
    message: issue.message,
  }));
  return {
    statusCode: BAD_REQUEST,
    body: {
      error,
      message: "Validation Error",
    },
  };
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new HttpError(`Not Found - ${req.originalUrl}`, NOT_FOUND);
  next(error);
};

export const errorHandle = (
  err: Error | HttpError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
      stack: NODE_ENV === "development" ? err.stack : undefined,
    });
    return;
  }

  if (err instanceof ZodError) {
    const { statusCode, body } = handleZodError(err);
    res.status(statusCode).json(body);
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};
