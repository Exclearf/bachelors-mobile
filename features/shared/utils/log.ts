import { consoleTransport, logger } from "react-native-logs";

const log = logger.createLogger({
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
});

export default log;
