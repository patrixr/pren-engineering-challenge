import "express-validator";
import "reflect-metadata";
import { initialiseDb } from "./component/db";
import { createHttpServer } from "./component/server";
import { logger } from "./component/logger";
import { APPLICATION_NAME, PORT } from "./component/constant";

console.log("initialiseDb");
initialiseDb()
  .then(() => {
    const server = createHttpServer();
    server.listen(PORT, () => {
      logger.info(`${APPLICATION_NAME} is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
