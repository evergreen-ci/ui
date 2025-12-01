/**
 * `msToDuration` converts a number of milliseconds to a string representing the duration
 * @param ms - milliseconds
 * @returns - a string representing the duration in the format of "1d 2h 3m 4s"
 */
export const msToDuration = (ms: number): string => {
  if (ms === 0) {
    return "0s";
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.floor(ms / msPerDay);
  const daysMilli = ms % msPerDay;

  const msPerHour = 60 * 60 * 1000;
  const hours = Math.floor(daysMilli / msPerHour);
  const hoursMilli = ms % msPerHour;

  const msPerMinute = 60 * 1000;
  const minutes = Math.floor(hoursMilli / msPerMinute);
  const minutesMilli = ms % msPerMinute;

  const seconds = Math.floor(minutesMilli / 1000);

  if (days > 0) {
    return `${Math.trunc(days)}d ${hours}h ${minutes}m ${seconds}s`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  if (seconds > 0) {
    return `${seconds}s`;
  }
  return `${ms}ms`;
};
