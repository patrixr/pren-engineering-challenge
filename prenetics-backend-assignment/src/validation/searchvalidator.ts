import { Request } from "express";
import { ResultType } from "../component/type";

export const validateSampleSearchRequest = (req: Request) => {
  // Sanitization
  req.sanitize("page[offset]").toInt();
  req.sanitize("page[limit]").toInt();
  req.sanitize("sampleId").trim();
  req.sanitize("patientName").trim();

  // Validation
  req
    .checkParams("org")
    .exists()
    .isUUID()
    .withMessage("Organisation ID must be a valid UUID");

  req
    .checkQuery("page[offset]")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Page offset must be a non-negative integer");

  req
    .checkQuery("page[limit]")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page limit must be a positive integer");

  req
    .checkQuery("sampleId")
    .optional()
    .isUUID()
    .withMessage("Sample ID must be a valid UUID");

  req
    .checkQuery("patientName")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Patient name cannot be empty");

  req
    .checkQuery("activateTime")
    .optional()
    .isISO8601()
    .withMessage("Activate time must be a valid date");

  req
    .checkQuery("resultTime")
    .optional()
    .isISO8601()
    .withMessage("Result time must be a valid date");

  req
    .checkQuery("type")
    .optional()
    .isIn(Object.values(ResultType))
    .withMessage(
      `Result type must be one of: ${Object.values(ResultType).join(", ")}`,
    );
};
