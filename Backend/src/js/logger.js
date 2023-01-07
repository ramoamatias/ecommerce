import log4js from "log4js";


log4js.configure({
  appenders: {
    myConsole: { type: "console" }, //Apender base- basico
    myErrorFile: { type: "file", filename: "/errors/error.log" },
    logDebug: {
      type: "logLevelFilter",
      appender: "myConsole",
      level: "info",
    },
    logError: {
      type: "logLevelFilter",
      appender: "myErrorFile",
      level: "error",
    }
  },
  categories: {
    default: { appenders: ["logDebug", "logError"], level: "all" },
  },
});

export let logger = log4js.getLogger();
