import { Request } from 'express';
import { ResultType } from '../component/type';
import { SearchOpts } from '../component/search';

export function validateSampleSearchRequest(req: Request) {
  req.sanitize('page[offset]').toInt();
  req.sanitize('page[limit]').toInt();
  req.sanitize('sampleId').trim();
  req.sanitize('patientName').trim();

  req
    .checkQuery('include')
    .optional()
    .isString()
    .withMessage('Include field must be an array of extra fields to include');

  req
    .checkParams('org')
    .exists()
    .isUUID()
    .withMessage('Organisation ID must be a valid UUID');

  req
    .checkQuery('page[offset]')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Page offset must be a non-negative integer');

  req
    .checkQuery('page[limit]')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page limit must be a positive integer');

  req
    .checkQuery('sampleId')
    .optional()
    .isUUID()
    .withMessage('Sample ID must be a valid UUID');

  req
    .checkQuery('patientName')
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Patient name cannot be empty');

  req
    .checkQuery('patientId')
    .optional()
    .isUUID()
    .withMessage('Patient ID must be a valid UUID');

  req
    .checkQuery('activateTime')
    .optional()
    .isISO8601()
    .withMessage('Activate time must be a valid date');

  req
    .checkQuery('resultTime')
    .optional()
    .isISO8601()
    .withMessage('Result time must be a valid date');

  req
    .checkQuery('type')
    .optional()
    .isIn(Object.values(ResultType))
    .withMessage(
      `Result type must be one of: ${Object.values(ResultType).join(', ')}`,
    );
}

export function buildSearchOpts(request: Request): SearchOpts {
  const searchOpts: SearchOpts = {};

  if (request.query.page && request.query.page.offset) {
    searchOpts.pageOffset = parseInt(request.query.page.offset, 10);
  }

  if (request.query.page && request.query.page.limit) {
    searchOpts.pageLimit = parseInt(request.query.page.limit, 10);
  }

  if (request.query.sampleId) {
    searchOpts.sampleId = request.query.sampleId;
  }

  if (request.query.patientName) {
    searchOpts.patientName = request.query.patientName;
  }

  if (request.query.patientId) {
    searchOpts.patientId = request.query.patientId;
  }

  if (request.query.activateTime) {
    searchOpts.activateTime = request.query.activateTime;
  }

  if (request.query.resultTime) {
    searchOpts.resultTime = request.query.resultTime;
  }

  if (request.query.resultValue) {
    searchOpts.resultValue = request.query.resultValue;
  }

  if (request.query.include) {
    searchOpts.includeFields = request.query.include.split(',');
  }

  return searchOpts;
}
