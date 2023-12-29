import logger from "conf/logger";
import app from "conf/server";
import initDb from "scripts/initDb";
const PORT = process.env.NAKAMA_PORT || 7350;

initDb()
  .then(() => {
    logger.info("Database initialized");
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

app.listen(PORT, () => {
  logger.info(`Nakama server listening on port ${PORT}`);
});
