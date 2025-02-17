import { resolve } from "path";
import { Connection, createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { APPLICATION_NAME, CONFIG } from "./constant";
import { logger } from "./logger";
import { isTestEnv, readEnv } from "../utils/env";

const dbConfig: PostgresConnectionOptions = {
  url: readEnv("DB_URL", CONFIG.db.url),
  extra: {
    application_name: APPLICATION_NAME,
  },
  synchronize: false,
  logging: !isTestEnv(),
  entities: [`${resolve(__dirname, "../entity")}/**.{js,ts}`],
  migrations: [`${resolve(__dirname, "../migration")}/**.{js,ts}`],
  subscribers: [`${resolve(__dirname, "../subscriber")}/**.{js,ts}`],
  cli: {
    entitiesDir: resolve(__dirname, "../entity"),
    migrationsDir: resolve(__dirname, "../migration"),
    subscribersDir: resolve(__dirname, "../subscriber"),
  },
  cache: false,
  type: "postgres",
  schema: readEnv("DB_SCHEMA", CONFIG.db.schema),
  maxQueryExecutionTime: 200,
};

export async function initialiseDb(
  override: Partial<{
    url: string;
  }> = {},
): Promise<Connection> {
  logger.info(`Connecting to db...`);
  const connection = await createConnection({
    ...dbConfig,
    ...override,
  });
  logger.info(`DB Connection established`);
  await connection
    .createQueryRunner("master")
    .createSchema(CONFIG.db.schema, true);
  logger.info(`Created schema ${CONFIG.db.schema}`);
  await connection.runMigrations({ transaction: "each" });
  logger.info(`Migration completed against schema ${CONFIG.db.schema}`);
  return connection;
}
