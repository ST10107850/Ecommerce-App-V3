import expressAsyncHandler from "express-async-handler";
import HttpError from "../utils/HttpError";
import { CONFLICT, NOT_FOUND, OK } from "../constants/http.codes";
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

export const getPagnation = (Model: any) =>
  expressAsyncHandler(async (req, res, next) => {
    const currentPage = Number(req.query.currentPage) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (currentPage - 1) * limit;

    const doc = await Model.find({}).skip(skip).limit(limit);
    if (!doc) {
      return next(new HttpError("No documents found", NOT_FOUND));
    }
    res.status(OK).json({
      success: true,
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

export const updateDoc = (Model: any, columnName: string = "") =>
  expressAsyncHandler(async (req, res, next) => {
    const columnValue = req.body[columnName];

    if (columnValue) {
      const existingColumn = await Model.findOne({
        [columnName]: columnValue,
        _id: { $ne: req.params.id },
      });

      if (existingColumn) {
        throw new HttpError(`That ${columnName} already exists`, CONFLICT);
      }
    }

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

  export const getUserDoc = (Model: any, populateFields: any = "") =>
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
          if (typeof populateFields === "string") {
            query = query.populate(populateFields);
          } else if (typeof populateFields === "object") {
            query = query.populate(populateFields);
          }
        }
  
        const doc = await query.exec();
  
        res.status(200).json(doc);
      }
    );
  
