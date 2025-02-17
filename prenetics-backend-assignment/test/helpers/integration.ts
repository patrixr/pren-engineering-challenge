import { expect } from "chai";
import { initialiseDb } from "../../src/component/db";
import { createHttpServer } from "../../src/component/server";
import { Connection, createConnection } from "typeorm";
import { CONFIG } from "../../src/component/constant";
import { readEnv } from "../../src/utils/env";

type AppServer = ReturnType<typeof createHttpServer>;

type IntegrationSuiteState = {
  getConnection(): Connection;
  getServer(): AppServer;
};

function createTestDatabaseString(dbName: string = "postgres") {
  const port = readEnv("TEST_DB_PORT", "5432");
  const host = readEnv("TEST_DB_HOST", "localhost");
  const uname = readEnv("TEST_DB_USERNAME", "dummy");
  const password = readEnv("TEST_DB_PASSWORD", "dummy");
  return `postgresql://${uname}:${password}@${host}:${port}/${dbName}`;
}

async function createTestDatabase(dbName: string) {
  const url = createTestDatabaseString();
  const adminConn = await createConnection({
    type: "postgres",
    url: url,
  });

  await adminConn.query(`DROP DATABASE IF EXISTS ${dbName}`);
  await adminConn.query(`CREATE DATABASE ${dbName}`);
  await adminConn.close();

  return createTestDatabaseString(dbName);
}

async function deleteTestDatabase(dbName: string) {
  const url = createTestDatabaseString();
  const adminConn = await createConnection({
    type: "postgres",
    url: url,
  });

  await adminConn.query(`DROP DATABASE IF EXISTS ${dbName}`);
  await adminConn.close();
}

export function describeIntegration(
  title: string,
  fn: (state: IntegrationSuiteState) => void,
) {
  describe(title, () => {
    const dbName = "unittesting_" + Date.now();
    let connection: Connection;
    let app: AppServer;

    before(async () => {
      try {
        const url = await createTestDatabase(dbName);
        connection = await initialiseDb({ url });
        expect(connection).not.to.be.null;
        app = createHttpServer();
      } catch (e) {
        throw new Error(e);
      }
    });

    after(async () => {
      await connection.close();
      await deleteTestDatabase(dbName);
    });

    beforeEach(async () => {
      const entities = connection.entityMetadatas;

      for (const entity of entities) {
        await connection.query(`
            TRUNCATE TABLE ${CONFIG.db.schema}.${entity.tableName} CASCADE;
          `);
        const repository = connection.getRepository(entity.name);
        expect(await repository.count()).to.eq(0);
      }
    });

    fn({
      getConnection: () => connection,
      getServer: () => app!,
    });
  });
}
