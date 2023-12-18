import { createLogger, format, transports, Logger } from "winston";
const { combine, timestamp, label, printf, json } = format;

const SERVICE_NAME: string = process.env.NAKAMA_NAME as string;
const ROOT_DIR = process.env.ROOT_DIR;
const LOG_DIR = `${ROOT_DIR}/logs`;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const devLogger = (serviceName: string): Logger => {
  return createLogger({
    level: "info",
    format: combine(
      label({ label: serviceName }),
      timestamp({ format: "HH:mm:ss" }),
      myFormat
    ),
    transports: [new transports.Console()],
  });
};

const debugLogger = (serviceName: string, logDir: string): Logger => {
  return createLogger({
    level: "info",
    format: combine(
      label({ label: serviceName }),
      timestamp({ format: "HH:mm:ss" }),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: `${logDir}/${serviceName}/debug.log`,
        level: "debug",
      }),
    ],
  });
};

const prodLogger = (serviceName: string, logDir: string): Logger => {
  return createLogger({
    format: combine(label({ label: serviceName }), timestamp(), json()),
    transports: [
      new transports.File({
        filename: `${logDir}/error.log`,
        level: "error",
      }),
    ],
  });
};

let logger = devLogger(SERVICE_NAME);

const DEBUG_LEVEL = process.env.DEBUG_LEVEL;
if (DEBUG_LEVEL === "debug") {
  logger = debugLogger(SERVICE_NAME, LOG_DIR);
} else if (DEBUG_LEVEL === "prod") {
  logger = prodLogger(SERVICE_NAME, LOG_DIR);
}
export default logger;
