/**
 * `trimSeverity` trims the severity prefix from a line
 * @param line - the line to trim
 * @returns - the line without the severity prefix
 */
export const trimSeverity = (line: string) => {
  if (line.startsWith("[P: ")) {
    return line.substring(8);
  }
  return line;
};

enum GripLevel {
  Emergency = 100,
  Alert = 90,
  Critical = 80,
  Error = 70,
  Warning = 60,
  Notice = 50,
  Info = 40,
  Debug = 30,
  Trace = 20,
  Invalid = 0,
}

enum LogLevel {
  Error = "E",
  Warn = "W",
  Debug = "D",
  Info = "I",
}

export const mapLogLevelToColor: Record<LogLevel, string> = {
  [LogLevel.Error]: "#ff0000",
  [LogLevel.Warn]: "#ffa500",
  [LogLevel.Debug]: "#666",
  [LogLevel.Info]: "#333",
};

export const getSeverityMapping = (s: number): LogLevel => {
  if (s >= GripLevel.Error) {
    return LogLevel.Error;
  }
  if (s >= GripLevel.Warning) {
    return LogLevel.Warn;
  }
  if (s >= GripLevel.Info) {
    return LogLevel.Info;
  }
  if (s < GripLevel.Info) {
    return LogLevel.Debug;
  }
  return LogLevel.Info;
};
