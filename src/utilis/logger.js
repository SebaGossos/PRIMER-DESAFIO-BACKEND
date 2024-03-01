import winston from "winston";
import config from "../config/config.js";

const environment = config.environment;

const winstonCustom = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "white",
    error: "green",
    warning: "blue",
    info: "yellow",
    http: "magenta",
    debug: "red",
  },
};

winston.addColors(winstonCustom.colors);

const createLogger = (env) => {
  if (env === "PROD") {
    return winston.createLogger({
      levels: winstonCustom.levels,
      transports: [
        new winston.transports.File({
          filename: "errors.log",
          level: "error",
          format: winston.format.json(),
        }),
        new winston.transports.Console({
          filename: "errors.log",
          level: "info",
          format: winston.format.json(),
        }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: winstonCustom.levels,
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }
};

const logger = createLogger(environment);

export default logger;
