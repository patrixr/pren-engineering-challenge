import { EntityManager } from "typeorm";
import { Organisation } from "../entity/organisation";
import { Result } from "../entity/result";
import { formatDate } from "../utils/formats";

export type SearchOpts = {
  pageOffset?: number;
  pageLimit?: number;
  sampleId?: string;
  patientName?: string;
  activateTime?: string;
  resultTime?: string;
  resultValue?: string;
};

const DEFAULT_PAGE_SIZE = 15;

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
      id: result.resultId,
      type: "sample",
      attributes: {
        result: result.result,
        sampleId: result.sampleId,
        resultType: result.type,
        activateTime: formatDate(result.activateTime),
        resultTime: formatDate(result.resultTime),
      },
      relationships: {
        profile: {
          data: {
            type: "profile",
            id: result.profile.profileId,
          },
        },
      },
    })),
    included: Array.from(
      new Set(results.map((result) => result.profile.profileId)),
    ).map((profileId) => {
      const profile = results.find(
        (r) => r.profile.profileId === profileId,
      )!.profile;
      return {
        type: "profile",
        id: profile.profileId,
        attributes: {
          name: profile.name,
        },
      };
    }),
  };

  return response;
}
