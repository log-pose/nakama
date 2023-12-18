const { logger: loggerLib } = require("../../../lib");
const { devLogger, debugLogger, prodLogger } = loggerLib;

const SERVICE_NAME: string = process.env.NAKAMA_NAME as string;
const ROOT_DIR = process.env.ROOT_DIR;
const LOG_DIR = `${ROOT_DIR}/logs`;

let logger = devLogger(SERVICE_NAME);

const DEBUG_LEVEL = process.env.DEBUG_LEVEL;
if (DEBUG_LEVEL === "debug") {
  logger = debugLogger(SERVICE_NAME, LOG_DIR);
} else if (DEBUG_LEVEL === "prod") {
  logger = prodLogger(SERVICE_NAME, LOG_DIR);
}
export default logger;
