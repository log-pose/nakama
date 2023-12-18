import logger from "conf/logger";
import app from "conf/server";

const PORT = process.env.NAKAMA_PORT || 7350;

app.listen(PORT, () => {
  logger.info(`Nakama server listening on port ${PORT}`);
});
