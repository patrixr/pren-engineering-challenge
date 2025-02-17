# Backend Engineering Challenge Approach

## 1. Overview

To design the API, I looked at the Swagger file and the mock data present in search.ts. And took the following steps:

- Created factories for easy mock data
- Write tests based on the mock data, and ensured they passed
- Wrote the required express-validator code to match the parameters in the Swagger file
- Updated the implementation and verified it passed the tests
- Added features according to instructions by:
  - Modifying tests (integration/api tests and component/unit tests)
  - Implementing and testing the features

## 2. Testing approach

Tests have been written at 2 different levels:

- API level (high/integration)
- Component level (low)

The key principle being that high level tests allow us to prove our product is working (or not) as intended, and lower level tests allow us to pinpoint the areas which are problematic when issues occur.

Here's an example integration test:

```typescript
describeIntegration("Search API", ({ getServer }) => {
  describe("/v1.0/org", () => {
    it("returns organisations", async () => {
      const { body } = await request(getServer())
        .get("/test/v1.0/org")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(body).to.have.property("data");
      expect(body.data).to.have.lengthOf(/* number of organisations */);
    });
  });
});
```

### Integration testing strategy

To write integration tests, there are typically 2 kinds of strategies:

1. By using an in-memory database as substitude for a real one
2. By using a real production-like database

In our case, we opted for option 2, and are using a real database for testing. Although being harder to orchestrate, it generally provides a higher level of confidence in the solution as it does not allow for edge-cases due to different engines running.

Integration tests are structured in the following way:

```javascript
describe("integration test", () => {
  before(async () => {
    // Set up a test database
  });

  beforeEach(async () => {
    // prepare the database
  });

  it("should do something", async () => {
    // test the API
  });

  after(async () => {
    // destroy the database
  });
});
```

A `describeIntegration` helper was added to the project to make this easier.

For each integration test suite, we create a new database (with a unique name) and destroy it after the tests are done. This ensures that the tests are isolated and do not interfere with each other.
An alternative method would have been to use transactions (harder to set up) or using schemas per tests. That last method was not chosen becaue of the current "test" schema being hardcoded in the migration files.

### Overview of tests

As of writing, the test suite looks something like this:

> Note: Tests were written to be exemplary and not exhaustive

```
Search API
    /v1.0/org
      ✓ returns an empty list if there are not organisations
      ✓ returns the list of organisations
    /v1.0/org/:org/sample
      response structure
        ✓ includes the number of records returned in the response
        ✓ returns the records in the correct order
        ✓ includes relationships in the response
      validation
        ✓ fails with bad pagination data
        ✓ fails with invalid date formats
        ✓ fails with invalid UUID format
        ✓ fails with invalid sample ID format
        ✓ fails with empty patient name
        ✓ fails with multiple invalid parameters
        ✓ accepts valid parameters
      filtering
        ✓ filters by patient ID
        ✓ filters by patient name
        ✓ filters by resultTime
        ✓ filters by activateTime
        ✓ filters by result value
        ✓ filters by sample ID
      additional fields
        ✓ allows including the result type and profileId
      pagination
        ✓ returns a page of 15 by default (55ms)
        ✓ returns the number of results specified by page size (69ms)
        ✓ returns the right page

  Search component
    ✓ returns a meta, data and included properties
    ✓ returns an empty list if there are no records
    ✓ sets the type and id at the root of each result
    ✓ sets the results details under the attributes field
    additional extra fields
      ✓ allows including the resultType field in the attributes
      ✓ allows including the profileId field in the profile
    filtering
      ✓ filters by patient name
      ✓ filters by patient ID
      ✓ filters by sample ID
      ✓ filters by activate time
      ✓ filters by result value
      ✓ filters by result time
      ✓ filters by multiple fields (time + patient name)
    pagination
      ✓ returns a maximum of 15 results by default (46ms)
      ✓ returns the number of results specified by page size
      ✓ returns the page specified
      ✓ includes pagination information in the meta

  Date Format
    ✓ formats date to correct string format
```

## 3. Base project updates

Here are the updates made to the base project, to fix issues found during development:

- Postgres version updated (It did not boot properly due to a problematic Postgres package version)
- Integration testing setup
- NPM scripts modified to decouple some of the commands for ease of use (e.g. testing & linting)
- Docker compose structure was modified to accomodate for integration tests using a real database (and not an in-memory one)
