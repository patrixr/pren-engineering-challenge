import { EntityManager } from "typeorm";
import { Organisation } from "../entity/organisation";
import { Result } from "../entity/result";
import { serializeProfile } from "../serialization/profileserializer";
import { serializeResult } from "../serialization/resultserializer";

export type SearchOpts = {
  pageOffset?: number;
  pageLimit?: number;
  sampleId?: string;
  patientName?: string;
  patientId?: string;
  activateTime?: string;
  resultTime?: string;
  resultValue?: string;
  includeFields?: string[];
};

const DEFAULT_PAGE_SIZE = 15;

const INCLUDABLE_FIELDS: Record<string, { type: string; key: string }> = {
  profileId: { type: "profile", key: "profileId" },
  resultType: { type: "result", key: "type" },
};

export async function search(
  manager: EntityManager,
  organisation: Organisation,
  opts: SearchOpts = {},
) {
  const repo = manager.getRepository(Result);

  const page = opts.pageOffset ?? 0;
  const pageSize = opts.pageLimit ?? DEFAULT_PAGE_SIZE;

  let query = repo
    .createQueryBuilder("result")
    .leftJoinAndSelect("result.profile", "profile")
    .leftJoin("profile.organisation", "organisation")
    .where("organisation.organisationId = :orgId", {
      orgId: organisation.organisationId,
    });

  if (opts.patientName) {
    query = query.andWhere("profile.name = :name", { name: opts.patientName });
  }

  if (opts.patientId) {
    query = query.andWhere("profile.profileId = :profileId", {
      profileId: opts.patientId,
    });
  }

  if (opts.sampleId) {
    query = query.andWhere("result.sampleId = :sampleId", {
      sampleId: opts.sampleId,
    });
  }

  if (opts.activateTime) {
    query = query.andWhere("result.activateTime = :activateTime", {
      activateTime: new Date(opts.activateTime),
    });
  }

  if (opts.resultTime) {
    query = query.andWhere("result.resultTime = :resultTime", {
      resultTime: new Date(opts.resultTime),
    });
  }

  if (opts.resultValue) {
    query = query.andWhere("result.result = :result", {
      result: JSON.stringify(opts.resultValue),
    });
  }

  const fieldsToInclude: Record<string, string[]> = {
    profile: ["name"],
    result: ["result", "sampleId", "activateTime", "resultTime"],
  };

  (opts.includeFields ?? []).forEach((field) => {
    if (INCLUDABLE_FIELDS[field]) {
      const { key, type } = INCLUDABLE_FIELDS[field];
      if (fieldsToInclude[type]) {
        fieldsToInclude[type].push(key);
      }
      query = query.addSelect(`${type}.${key}`);
    }
  });

  const [results, total] = await query
    .orderBy("result.activateTime", "ASC")
    .skip(page * pageSize)
    .take(pageSize)
    .getManyAndCount();

  const response = {
    meta: {
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    },
    data: results.map((result) => ({
      ...serializeResult(result, fieldsToInclude.result),
      relationships: {
        profile: {
          data: serializeProfile(result.profile),
        },
      },
    })),
    included: Array.from(
      new Set(results.map((result) => result.profile.profileId)),
    ).map((profileId) => {
      const rec = results.find((r) => r.profile.profileId === profileId)!;
      return serializeProfile(rec.profile, fieldsToInclude.profile);
    }),
  };

  return response;
}
