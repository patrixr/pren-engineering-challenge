import { Organisation } from "../entities/organisation";
import { ApiDataResponse, ApiSearchResponse } from "../entities/response";
import { Result } from "../entities/result";
import { RestService } from "./base";

export type SearchOptions = {
  pageOffset?: number;
  pageLimit?: number;
  sampleId?: string;
  patientName?: string;
  patientId?: string;
  activateTime?: string;
  resultTime?: string;
  resultValue?: string;
  includeFields?: string[];
  q?: string;
}

export class TestApi extends RestService {
  constructor(baseUrl = "http://localhost:8080/test/v1.0") {
    super(baseUrl);
  }

  async listOrganisations() {
    return this.get("/org") as Promise<ApiDataResponse<Organisation>>
  }

  async searchResults(organisationId: string, opts: SearchOptions = {}) {
    const queryParams : Record<string, string> = {}

    if (opts.pageOffset) {
      queryParams["page[offset]"] = opts.pageOffset.toString();
    }

    if (opts.pageLimit) {
      queryParams["page[limit]"] = opts.pageLimit.toString();
    }

    if (opts.sampleId) {
      queryParams["sampleId"] = opts.sampleId;
    }
    
    if (opts.patientName) {
      queryParams["patientName"] = opts.patientName;
    }

    if (opts.patientId) {
      queryParams["patientId"] = opts.patientId;
    }

    if (opts.activateTime) {
      queryParams["activateTime"] = opts.activateTime;
    }

    if (opts.resultTime) {
      queryParams["resultTime"] = opts.resultTime;
    }

    if (opts.resultValue) {
      queryParams["resultValue"] = opts.resultValue;
    }

    if (opts.includeFields) {
      queryParams["include"] = opts.includeFields.join(",");
    }

    if (opts.q) {
      queryParams["q"] = opts.q;
    }

    return this.get(`/org/${organisationId}/sample`) as Promise<ApiSearchResponse<Result>>
  }
}