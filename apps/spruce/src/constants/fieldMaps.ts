export const defaultTimeZone = "America/New_York";

export const timeZones = [
  {
    str: "Coordinated Universal Time",
    value: "UTC",
  },
  {
    str: "American Samoa, Niue",
    value: "Pacific/Niue",
  },
  {
    str: "Hawaii",
    value: "Pacific/Tahiti",
  },
  {
    str: "Marquesas Islands",
    value: "Pacific/Marquesas",
  },
  {
    str: "Alaska",
    value: "America/Anchorage",
  },
  {
    str: "Pacific Time",
    value: "America/Vancouver",
  },
  {
    str: "Mountain Time",
    value: "America/Denver",
  },
  {
    str: "Central Time",
    value: "America/Chicago",
  },
  {
    str: "Eastern Time",
    value: defaultTimeZone,
  },
  {
    str: "Venezuela",
    value: "America/Caracas",
  },
  {
    str: "Atlantic Time",
    value: "America/Barbados",
  },
  {
    str: "Newfoundland",
    value: "America/St_Johns",
  },
  {
    str: "Argentina, Paraguay",
    value: "America/Belem",
  },
  {
    str: "Fernando de Noronha",
    value: "America/Noronha",
  },
  {
    str: "Cape Verde",
    value: "Atlantic/Cape_Verde",
  },
  {
    str: "Iceland",
    value: "Atlantic/Reykjavik",
  },
  {
    str: "United Kingdom, Ireland",
    value: "Europe/London",
  },
  {
    str: "Central European Time, Nigeria",
    value: "Europe/Rome",
  },
  {
    str: "Egypt, Israel, Romania",
    value: "Europe/Bucharest",
  },
  {
    str: "Ethiopia, Iraq, Yemen",
    value: "Asia/Baghdad",
  },
  {
    str: "Iran",
    value: "Asia/Tehran",
  },
  {
    str: "Dubai, Moscow",
    value: "Europe/Moscow",
  },
  {
    str: "Afghanistan",
    value: "Asia/Kabul",
  },
  {
    str: "Maldives, Pakistan",
    value: "Antarctica/Davis",
  },
  {
    str: "India, Sri Lanka",
    value: "Asia/Kolkata",
  },
  {
    str: "Nepal",
    value: "Asia/Kathmandu",
  },
  {
    str: "Bangladesh, Bhutan",
    value: "Asia/Dhaka",
  },
  {
    str: "Cocos Islands, Myanmar",
    value: "Asia/Rangoon",
  },
  {
    str: "Thailand, Vietnam",
    value: "Asia/Bangkok",
  },
  {
    str: "China, Hong Kong, Perth",
    value: "Asia/Hong_Kong",
  },
  {
    str: "Eucla (Unofficial)",
    value: "Australia/Eucla",
  },
  {
    str: "Japan, South Korea",
    value: "Asia/Seoul",
  },
  {
    str: "Australia Central Time",
    value: "Australia/Adelaide",
  },
  {
    str: "Australia Eastern Time",
    value: "Australia/Sydney",
  },
  {
    str: "Lord Howe Island",
    value: "Australia/Lord_Howe",
  },
  {
    str: "Russia Vladivostok Time",
    value: "Asia/Vladivostok",
  },
  {
    str: "Norfolk Island",
    value: "Pacific/Norfolk",
  },
  {
    str: "Fiji, Russia Magadan Time",
    value: "Asia/Magadan",
  },
  {
    str: "Chatham Islands",
    value: "Pacific/Chatham",
  },
  {
    str: "Tonga",
    value: "Pacific/Tongatapu",
  },
  {
    str: "Kiribati Line Islands",
    value: "Pacific/Kiritimati",
  },
];

// Access a time zone's readable name by its key value
export const prettifyTimeZone = new Map(
  timeZones.map(({ str, value }) => [value, str]),
);

/**
 * abbreviateTimeZone returns the shortened version of a time zone
 * @param tz - JS timeZone option used by toLocaleTimeString
 * @returns - shortened string, or empty string if invalid time zone provided
 */
export const abbreviateTimeZone = (tz: string) => {
  try {
    return new Date()
      .toLocaleTimeString("en-us", { timeZone: tz, timeZoneName: "short" })
      .split(" ")[2];
  } catch (e) {
    return "";
  }
};

export const listOfDateFormatStrings = [
  "MM-dd-yyyy",
  "dd-MM-yyyy",
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "dd/MM/yyyy",
  "yyyy/MM/dd",
  "MMM d, yyyy",
];

export enum TimeFormat {
  TwelveHour = "h:mm:ss aa",
  TwentyFourHour = "H:mm:ss",
}

export const notificationFields = {
  patchFinish: "Patch finish",
  patchFirstFailure: "Patch first task failure",
  spawnHostOutcome: "Spawn host outcome",
  spawnHostExpiration: "Spawn host expiration",
  buildBreak: "Build break",
};

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
