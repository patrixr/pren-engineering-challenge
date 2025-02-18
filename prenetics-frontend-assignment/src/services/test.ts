import { Organisation } from "../entities/organisation";
import { Result } from "../entities/profile";
import { ApiDataResponse, ApiSearchResponse } from "../entities/response";
import { Profile } from "../entities/result";
import { RestService } from "./base";
import { faker } from "@faker-js/faker"

export type SearchOptions = {
  pageOffset?: number;
  pageLimit?: number;
  sampleId?: string;
  patientName?: string;
  patientId?: string;
  activateTime?: string;
  resultTime?: string;
  resultValue?: string;
  include?: string[];
  q?: string;
}

export class TestApi extends RestService {
  constructor(baseUrl = "http://localhost:8080/test/v1.0") {
    super(baseUrl);
  }

  async listOrganisations() {
    return this.get("/org") as Promise<ApiDataResponse<Organisation[]>>
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

    if (opts.include) {
      queryParams["include"] = opts.include.join(",");
    }

    if (opts.q) {
      queryParams["q"] = opts.q;
    }

    return this.get(`/org/${organisationId}/sample`, queryParams) as Promise<ApiSearchResponse<Result[]>>
  }

  async createDummyProfile(orgId: string) {
    return this.post<ApiDataResponse<Profile>>(`/org/${orgId}/profile`, {
      "data": {
        "type": "profile",
        "attributes": {
          "name": faker.person.fullName()
        }
      }
    });
  }

  async createDummyResult(orgId: string, profileId: string) {
    return this.post<ApiDataResponse<Result>>(`/org/${orgId}/profile/${profileId}/sample`, {
      "data": {
        "type": "sample",
        "attributes": {
          "sampleId": faker.string.uuid(),
          "resultType": faker.helpers.arrayElement(["rtpcr", "antibody", "rtlamp", "antigen"]),
          "result": faker.helpers.arrayElement(["positive", "negative"]),
          "activateTime": faker.date.recent().toISOString(),
          "resultTime": faker.date.recent().toISOString(),
        }
      }
    });
  }
}