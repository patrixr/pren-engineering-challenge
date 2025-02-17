import request from "supertest";
import {} from "mocha";
import { describeIntegration } from "../helpers/integration";
import {
  createFakeOrganisation,
  createFakeProfile,
  createFakeResult,
} from "../helpers/factories";
import { expect } from "chai";
import { Organisation } from "../../src/entity/organisation";
import { ResultType } from "../../src/component/type";

describeIntegration("Search API", ({ getServer }) => {
  describe("/v1.0/org", () => {
    it("returns an empty list if there are not organisations", async () => {
      const { body } = await request(getServer())
        .get("/test/v1.0/org")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(body).to.have.property("data");
      expect(body.data).to.have.lengthOf(0);
    });

    it("returns the list of organisations", async () => {
      await createFakeOrganisation();
      await createFakeOrganisation();
      await createFakeOrganisation();

      const { body } = await request(getServer())
        .get("/test/v1.0/org")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(body).to.have.property("data");
      expect(body.data).to.have.lengthOf(3);
    });
  });

  describe("/v1.0/org/:org/sample", () => {
    let organisation: Organisation;

    beforeEach(async () => {
      organisation = await createFakeOrganisation();
    });

    describe("response structure", () => {
      beforeEach(async () => {
        const profiles = await Promise.all([
          createFakeProfile({
            profileId: "b66df241-e780-4c9c-aeb1-0efc4946face",
            name: "Peter Chan",
            organisation,
          }),
          createFakeProfile({
            profileId: "0bf3bd3b-75bc-4540-ba04-a19ab5e9382c",
            name: "Andrea Lau",
            organisation,
          }),
          createFakeProfile({
            profileId: "b50d027e-d8c5-496b-8665-dd2281ab1b32",
            name: "John Locke",
            organisation,
          }),
          createFakeProfile({
            profileId: "97932431-d7de-48ec-9f51-d0d78170ffe9",
            name: "Bruce Lee",
            organisation,
          }),
          createFakeProfile({
            profileId: "47d67686-b77f-47e8-92e4-76f1b5f1bc92",
            name: "Michael Caine",
            organisation,
          }),
        ]);

        await Promise.all([
          createFakeResult({
            resultId: "1c22dfc1-9c85-4ef9-a9d3-41a1e98a4d41",
            result: "negative",
            sampleId: "1234567890",
            type: ResultType.antibody,
            activateTime: new Date("2021-07-01T15:00:00.000Z"),
            resultTime: new Date("2021-07-01T16:00:00.000Z"),
            profile: profiles[0],
          }),
          createFakeResult({
            resultId: "98627793-ee13-4eaf-a304-9e628d110f3c",
            result: "negative",
            sampleId: "0987654321",
            type: ResultType.antigen,
            activateTime: new Date("2021-07-02T15:00:00.000Z"),
            resultTime: new Date("2021-07-02T16:00:00.000Z"),
            profile: profiles[1],
          }),
          createFakeResult({
            resultId: "ab5b87ef-e44f-4b1f-98cb-992f2104ef8f",
            result: "negative",
            sampleId: "109876543211",
            type: ResultType.rtpcr,
            activateTime: new Date("2021-07-03T15:00:00.000Z"),
            resultTime: new Date("2021-07-03T16:00:00.000Z"),
            profile: profiles[2],
          }),
          createFakeResult({
            resultId: "8423dfd3-37b5-4c62-a37c-729e410d19e5",
            result: "negative",
            sampleId: "121212121212",
            type: ResultType.antibody,
            activateTime: new Date("2021-07-04T15:00:00.000Z"),
            resultTime: new Date("2021-07-04T16:00:00.000Z"),
            profile: profiles[3],
          }),
          createFakeResult({
            resultId: "567a8b28-c1ab-467d-85ff-04fbcb24cb9a",
            result: "negative",
            sampleId: "181818188181",
            type: ResultType.rtpcr,
            activateTime: new Date("2021-07-05T15:00:00.000Z"),
            resultTime: new Date("2021-07-05T16:00:00.000Z"),
            profile: profiles[4],
          }),
        ]);
      });

      it("includes the number of records returned in the response", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body).to.have.property("meta");
        expect(body.meta).to.have.property("total");
        expect(body.meta.total).to.eq(5);
      });

      it("returns the records in the correct order", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.deep.equal([
          {
            id: "1c22dfc1-9c85-4ef9-a9d3-41a1e98a4d41",
            type: "sample",
            attributes: {
              result: "negative",
              sampleId: "1234567890",
              activateTime: "2021-07-01 15:00:00",
              resultTime: "2021-07-01 16:00:00",
            },
            relationships: {
              profile: {
                data: {
                  type: "profile",
                  id: "b66df241-e780-4c9c-aeb1-0efc4946face",
                },
              },
            },
          },
          {
            id: "98627793-ee13-4eaf-a304-9e628d110f3c",
            type: "sample",
            attributes: {
              result: "negative",
              sampleId: "0987654321",
              activateTime: "2021-07-02 15:00:00",
              resultTime: "2021-07-02 16:00:00",
            },
            relationships: {
              profile: {
                data: {
                  type: "profile",
                  id: "0bf3bd3b-75bc-4540-ba04-a19ab5e9382c",
                },
              },
            },
          },
          {
            id: "ab5b87ef-e44f-4b1f-98cb-992f2104ef8f",
            type: "sample",
            attributes: {
              result: "negative",
              sampleId: "109876543211",
              activateTime: "2021-07-03 15:00:00",
              resultTime: "2021-07-03 16:00:00",
            },
            relationships: {
              profile: {
                data: {
                  type: "profile",
                  id: "b50d027e-d8c5-496b-8665-dd2281ab1b32",
                },
              },
            },
          },
          {
            id: "8423dfd3-37b5-4c62-a37c-729e410d19e5",
            type: "sample",
            attributes: {
              result: "negative",
              sampleId: "121212121212",
              activateTime: "2021-07-04 15:00:00",
              resultTime: "2021-07-04 16:00:00",
            },
            relationships: {
              profile: {
                data: {
                  type: "profile",
                  id: "97932431-d7de-48ec-9f51-d0d78170ffe9",
                },
              },
            },
          },
          {
            id: "567a8b28-c1ab-467d-85ff-04fbcb24cb9a",
            type: "sample",
            attributes: {
              result: "negative",
              sampleId: "181818188181",
              activateTime: "2021-07-05 15:00:00",
              resultTime: "2021-07-05 16:00:00",
            },
            relationships: {
              profile: {
                data: {
                  type: "profile",
                  id: "47d67686-b77f-47e8-92e4-76f1b5f1bc92",
                },
              },
            },
          },
        ]);
      });

      it("includes relationships in the response", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.included).to.have.deep.members([
          {
            type: "profile",
            id: "0bf3bd3b-75bc-4540-ba04-a19ab5e9382c",
            attributes: {
              name: "Andrea Lau",
            },
          },
          {
            type: "profile",
            id: "97932431-d7de-48ec-9f51-d0d78170ffe9",
            attributes: {
              name: "Bruce Lee",
            },
          },
          {
            type: "profile",
            id: "b50d027e-d8c5-496b-8665-dd2281ab1b32",
            attributes: {
              name: "John Locke",
            },
          },
          {
            type: "profile",
            id: "47d67686-b77f-47e8-92e4-76f1b5f1bc92",
            attributes: {
              name: "Michael Caine",
            },
          },
          {
            type: "profile",
            id: "b66df241-e780-4c9c-aeb1-0efc4946face",
            attributes: {
              name: "Peter Chan",
            },
          },
        ]);
      });
    });

    describe("validation", () => {
      it("fails with bad pagination data", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            "page[offset]": -1,
            "page[limit]": 0,
          })
          .expect(400)
          .expect("Content-Type", /json/);

        expect(body).to.be.an("array");
        expect(body).to.deep.include.members([
          {
            location: "query",
            param: "page.offset",
            msg: "Page offset must be a non-negative integer",
            value: -1,
          },
          {
            location: "query",
            param: "page.limit",
            msg: "Page limit must be a positive integer",
            value: 0,
          },
        ]);
      });

      it("fails with invalid date formats", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            activateTime: "not-a-date",
            resultTime: "invalid-date",
          })
          .expect(400)
          .expect("Content-Type", /json/);

        expect(body).to.be.an("array");
        expect(body).to.deep.include.members([
          {
            location: "query",
            param: "activateTime",
            msg: "Activate time must be a valid date",
            value: "not-a-date",
          },
          {
            location: "query",
            param: "resultTime",
            msg: "Result time must be a valid date",
            value: "invalid-date",
          },
        ]);
      });

      it("fails with invalid UUID format", async () => {
        const { body } = await request(getServer())
          .get("/test/v1.0/org/not-a-uuid/sample")
          .expect(400)
          .expect("Content-Type", /json/);

        expect(body).to.be.an("array");
        expect(body).to.deep.include.members([
          {
            location: "params",
            param: "org",
            msg: "Organisation ID must be a valid UUID",
            value: "not-a-uuid",
          },
        ]);
      });

      it("fails with invalid sample ID format", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            sampleId: "not-a-uuid",
          })
          .expect(400)
          .expect("Content-Type", /json/);

        expect(body).to.be.an("array");
        expect(body).to.deep.include.members([
          {
            location: "query",
            param: "sampleId",
            msg: "Sample ID must be a valid UUID",
            value: "not-a-uuid",
          },
        ]);
      });

      it("fails with empty patient name", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            patientName: "",
          })
          .expect(400)
          .expect("Content-Type", /json/);

        expect(body).to.be.an("array");
        expect(body).to.deep.include.members([
          {
            location: "query",
            param: "patientName",
            msg: "Patient name cannot be empty",
            value: "",
          },
        ]);
      });

      it("fails with multiple invalid parameters", async () => {
        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            "page[offset]": -1,
            sampleId: "invalid-uuid",
            activateTime: "not-a-date",
            patientName: "",
          })
          .expect(400)
          .expect("Content-Type", /json/);

        expect(body).to.be.an("array");
        expect(body).to.deep.include.members([
          {
            location: "query",
            param: "page.offset",
            msg: "Page offset must be a non-negative integer",
            value: -1,
          },
          {
            location: "query",
            param: "sampleId",
            msg: "Sample ID must be a valid UUID",
            value: "invalid-uuid",
          },
          {
            location: "query",
            param: "activateTime",
            msg: "Activate time must be a valid date",
            value: "not-a-date",
          },
          {
            location: "query",
            param: "patientName",
            msg: "Patient name cannot be empty",
            value: "",
          },
        ]);
      });

      it("accepts valid parameters", async () => {
        await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            "page[offset]": 0,
            "page[limit]": 10,
            sampleId: organisation.organisationId, // Using org ID as a valid UUID
            activateTime: "2023-01-01T00:00:00Z",
            resultTime: "2023-01-02T00:00:00Z",
            patientName: "John Doe",
          })
          .expect(200)
          .expect("Content-Type", /json/);
      });
    });

    describe("filtering", () => {
      it("filters by patient name", async () => {
        for (let i = 0; i < 5; i++) {
          const profile = await createFakeProfile({
            organisation,
            profileId: `${i}0000000-0000-0000-0000-000000000000`,
            name: `Patient ${i}`,
          });
          await createFakeResult({ profile });
          await createFakeResult({ profile });
          await createFakeResult({ profile });
        }

        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            patientName: "Patient 3",
          })
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.have.lengthOf(3);
        for (const sample of body.data) {
          expect(sample.relationships.profile.data.id).to.eq(
            "30000000-0000-0000-0000-000000000000",
          );
        }
      });

      ["resultTime", "activateTime"].forEach((field) => {
        it(`filters by ${field}`, async () => {
          for (let i = 0; i < 5; i++) {
            const profile = await createFakeProfile({ organisation });
            await createFakeResult({
              profile,
              [field]: new Date(`2021-01-0${i + 1}`),
            });
            await createFakeResult({ profile });
            await createFakeResult({ profile });
          }

          const { body } = await request(getServer())
            .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
            .query({
              [field]: "2021-01-03T00:00:00Z",
            })
            .expect(200)
            .expect("Content-Type", /json/);

          expect(body.data).to.have.lengthOf(1);
          for (const sample of body.data) {
            expect(sample.attributes[field]).to.eq("2021-01-03 00:00:00");
          }
        });
      });

      it("filters by result value", async () => {
        for (let i = 0; i < 5; i++) {
          const profile = await createFakeProfile({ organisation });
          await createFakeResult({ profile, result: "positive" });
          await createFakeResult({ profile, result: "negative" });
        }

        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            resultValue: "positive",
          })
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.have.lengthOf(5);
        for (const sample of body.data) {
          expect(sample.attributes.result).to.eq("positive");
        }
      });

      it("filters by sample ID", async () => {
        for (let i = 0; i < 5; i++) {
          const profile = await createFakeProfile({ organisation });
          await createFakeResult({
            profile,
            sampleId: `${i}0000000-0000-0000-0000-000000000000`,
          });
          await createFakeResult({ profile });
          await createFakeResult({ profile });
        }

        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            sampleId: "30000000-0000-0000-0000-000000000000",
          })
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.have.lengthOf(1);
        for (const sample of body.data) {
          expect(sample.attributes.sampleId).to.eq(
            "30000000-0000-0000-0000-000000000000",
          );
        }
      });
    });

    describe("additional fields", () => {
      it("allows including the result type and profileId", async () => {
        const profile = await createFakeProfile({
          organisation,
          profileId: "60000000-0000-0000-0000-000000000000",
        });
        await createFakeResult({ profile, type: ResultType.antibody });

        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            include: "resultType,profileId",
          })
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.have.lengthOf(1);
        expect(body.data[0].attributes.resultType).to.eq(ResultType.antibody);
        expect(body.included[0].attributes["profileId"]).to.eq(
          "60000000-0000-0000-0000-000000000000",
        );
      });
    });

    describe("pagination", () => {
      it("returns a page of 15 by default", async () => {
        for (let i = 0; i < 20; i++) {
          const profile = await createFakeProfile({ organisation });
          await createFakeResult({ profile });
        }

        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.have.lengthOf(15);
      });

      it("returns the number of results specified by page size", async () => {
        for (let i = 0; i < 20; i++) {
          const profile = await createFakeProfile({ organisation });
          await createFakeResult({ profile });
        }

        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            "page[limit]": 10,
          })
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.have.lengthOf(10);
      });

      it("returns the right page", async () => {
        for (let i = 0; i < 10; ++i) {
          const profile = await createFakeProfile({ organisation });
          await createFakeResult({
            profile,
            activateTime: new Date(`2021-01-0${i + 1}`),
            resultId: `${i}0000000-0000-0000-0000-000000000000`,
          });
        }

        const { body } = await request(getServer())
          .get(`/test/v1.0/org/${organisation.organisationId}/sample`)
          .query({
            "page[limit]": 3,
            "page[offset]": 2,
          })
          .expect(200)
          .expect("Content-Type", /json/);

        expect(body.data).to.have.lengthOf(3);
        expect(body.data[0].id).to.eq("60000000-0000-0000-0000-000000000000");
        expect(body.data[1].id).to.eq("70000000-0000-0000-0000-000000000000");
        expect(body.data[2].id).to.eq("80000000-0000-0000-0000-000000000000");
      });
    });
  });
});
