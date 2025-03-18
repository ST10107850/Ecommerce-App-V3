import expressAsyncHandler from "express-async-handler";
import HttpError from "../utils/HttpError";
import { NOT_FOUND, OK } from "../constants/http.codes";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export const getOneDoc = (Model: any) =>
  expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new HttpError("No document found with that ID", NOT_FOUND));
    }
    res.status(OK).json({
      success: true,
      id: req.params.id,
      data: doc,
    });
  });

export const getAllDoc = (Model: any) =>
  expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.find({})
      .populate({
        path: "userId",
        select: "firstName lastName",
      })
      .sort({ createdAt: -1 });

    res.status(OK).json({ success: true, result: doc.length, data: doc });
  });

export const deleteOneDoc = (Model: any) =>
  expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new HttpError("No document found with that ID", NOT_FOUND));
    }

    res.status(OK).json({ message: "Document deleted successfully" });
  });

export const updateDoc = (Model: any) =>
  expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new HttpError("No document found with that ID", NOT_FOUND));
    }

    res.status(OK).json({
      status: "Document updated sucessfully",
      data: doc,
    });
  });

export const getUserDoc = (Model: any, populateFields = "") =>
  expressAsyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user || !req.user._id) {
        return next(new HttpError("User not found", NOT_FOUND));
      }

      const queryCondition = Model.schema.paths.user
        ? { user: req.user._id }
        : { userId: req.user._id };

      let query = Model.find(queryCondition).sort({ createdAt: -1 });

      if (populateFields) {
        query = query.populate(populateFields);
      }

      const doc = await query;

      res.status(200).json(doc);
    }
  );
