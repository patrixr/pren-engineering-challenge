import { getRepository } from "typeorm";
import { Organisation } from "../../src/entity/organisation";
import { faker } from "@faker-js/faker";
import { Profile } from "../../src/entity/profile";
import { Result } from "../../src/entity/result";
import { ResultType } from "../../src/component/type";
import { expect } from "chai";

export async function createFakeResult(data: Partial<Result> = {}) {
  const profile = data.profile ?? (await createFakeProfile());

  const repo = getRepository(Result);
  const rid = data.resultId ?? faker.string.uuid();

  await repo.insert({
    resultId: rid,
    activateTime: data.activateTime ?? faker.date.anytime(),
    resultTime: data.resultTime ?? faker.date.anytime(),
    sampleId: data.sampleId ?? faker.number.int().toString(),
    result: JSON.stringify(data.result ?? "negative"),
    profile: profile,
    type: data.type ?? ResultType.antibody,
  });

  const res = await repo.findOne({ resultId: rid });
  expect(res).to.exist;
  return res!;
}

export async function createFakeProfile(data: Partial<Profile> = {}) {
  const org = data.organisation ?? (await createFakeOrganisation());

  const repo = getRepository(Profile);
  const pid = data.profileId ?? faker.string.uuid();

  await repo.insert({
    profileId: pid,
    name: data.name ?? faker.company.name(),
    datetime: data.datetime ?? faker.date.anytime(),
    organisation: org,
  });

  const res = await repo.findOne({ profileId: pid });
  expect(res).to.exist;
  return res!;
}

export async function createFakeOrganisation(
  data: Partial<Organisation> = {},
): Promise<Organisation> {
  const repo = getRepository(Organisation);
  const orgId = data.organisationId ?? faker.string.uuid();

  await repo.insert({
    organisationId: orgId,
    name: data.name ?? faker.company.name(),
    datetime: data.datetime ?? faker.date.anytime(),
  });

  const res = await repo.findOne({ organisationId: orgId });
  expect(res).to.exist;
  return res!;
}
