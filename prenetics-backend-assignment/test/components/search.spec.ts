import { describeIntegration } from "../helpers/integration";
import {
  createFakeOrganisation,
  createFakeProfile,
  createFakeResult,
} from "../helpers/factories";
import { Organisation } from "../../src/entity/organisation";
import { search } from "../../src/component/search";
import { EntityManager, getManager } from "typeorm";
import { expect } from "chai";
import { formatDate } from "../../src/utils/formats";

describeIntegration("Search component", () => {
  let organisation: Organisation;
  let manager: EntityManager;

  beforeEach(async () => {
    organisation = await createFakeOrganisation();
    manager = getManager();
  });

  it("returns a meta, data and included properties", async () => {
    const results = await search(manager, organisation);
    expect(results).to.have.property("meta");
    expect(results).to.have.property("data");
    expect(results).to.have.property("included");
  });

  it("returns an empty list if there are no records", async () => {
    const results = await search(manager, organisation);
    expect(results.data).to.be.empty;
  });

  it("sets the type and id at the root of each result", async () => {
    const profile = await createFakeProfile({ organisation });
    const result = await createFakeResult({ profile });

    const results = await search(manager, organisation);
    expect(results.data).to.have.lengthOf(1);
    expect(results.data[0]).to.have.property("id");
    expect(results.data[0]).to.have.property("type");
    expect(results.data[0].id).to.eq(result.resultId);
    expect(results.data[0].type).to.eq("sample");
  });

  it("sets the results details under the attributes field", async () => {
    const profile = await createFakeProfile({ organisation });
    const result = await createFakeResult({ profile });

    const results = await search(manager, organisation);
    expect(results.data[0]).to.have.property("attributes");
    expect(results.data[0].attributes.result).to.have.eq(result.result);
    expect(results.data[0].attributes.sampleId).to.have.eq(result.sampleId);
    expect(results.data[0].attributes.resultType).to.have.eq(result.type);
    expect(results.data[0].attributes.activateTime).to.have.eq(
      formatDate(result.activateTime),
    );
    expect(results.data[0].attributes.resultTime).to.have.eq(
      formatDate(result.resultTime),
    );
  });

  describe("pagination", () => {
    it("returns a maximum of 15 results by default", async () => {
      for (let i = 0; i < 20; ++i) {
        const profile = await createFakeProfile({ organisation });
        await createFakeResult({ profile });
      }

      const results = await search(manager, organisation);
      expect(results.data).to.have.lengthOf(15);
    });

    it("returns the number of results specified by page size", async () => {
      for (let i = 0; i < 10; ++i) {
        const profile = await createFakeProfile({ organisation });
        await createFakeResult({
          profile,
          activateTime: new Date(`2021-01-0${i + 1}`),
          resultId: `${i}0000000-0000-0000-0000-000000000000`,
        });
      }

      const results = await search(manager, organisation, { pageLimit: 5 });
      expect(results.data).to.have.lengthOf(5);
      expect(results.data[0].id).to.eq("00000000-0000-0000-0000-000000000000");
      expect(results.data[1].id).to.eq("10000000-0000-0000-0000-000000000000");
      expect(results.data[2].id).to.eq("20000000-0000-0000-0000-000000000000");
      expect(results.data[3].id).to.eq("30000000-0000-0000-0000-000000000000");
      expect(results.data[4].id).to.eq("40000000-0000-0000-0000-000000000000");
    });

    it("returns the page specified", async () => {
      for (let i = 0; i < 10; ++i) {
        const profile = await createFakeProfile({ organisation });
        await createFakeResult({
          profile,
          activateTime: new Date(`2021-01-0${i + 1}`),
          resultId: `${i}0000000-0000-0000-0000-000000000000`,
        });
      }

      const results = await search(manager, organisation, {
        pageLimit: 3,
        pageOffset: 1,
      });
      expect(results.data).to.have.lengthOf(3);
      expect(results.data[0].id).to.eq("30000000-0000-0000-0000-000000000000");
      expect(results.data[1].id).to.eq("40000000-0000-0000-0000-000000000000");
      expect(results.data[2].id).to.eq("50000000-0000-0000-0000-000000000000");
    });

    it("includes pagination information in the meta", async () => {
      for (let i = 0; i < 10; ++i) {
        const profile = await createFakeProfile({ organisation });
        await createFakeResult({
          profile,
          activateTime: new Date(`2021-01-0${i + 1}`),
          resultId: `${i}0000000-0000-0000-0000-000000000000`,
        });
      }

      const results = await search(manager, organisation, {
        pageLimit: 3,
        pageOffset: 1,
      });
      expect(results.meta).to.have.property("total");
      expect(results.meta).to.have.property("page");
      expect(results.meta).to.have.property("pageSize");
      expect(results.meta).to.have.property("pageCount");
      expect(results.meta.total).to.eq(10);
      expect(results.meta.page).to.eq(1);
      expect(results.meta.pageSize).to.eq(3);
      expect(results.meta.pageCount).to.eq(4);
    });
  });
});
