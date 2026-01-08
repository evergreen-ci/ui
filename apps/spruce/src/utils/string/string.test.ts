import { shortenGithash, trimStringFromMiddle } from "@evg-ui/lib/utils/string";
import { TimeFormat } from "constants/time";
import {
  msToDuration,
  getDateCopy,
  applyStrictRegex,
  joinWithConjunction,
  stripNewLines,
  getTicketFromJiraURL,
} from ".";

describe("msToDuration", () => {
  it("converts milli to 1h 20m", () => {
    const ms = 80 * 60 * 1000;
    expect(msToDuration(ms)).toBe("1h 20m");
  });

  it("converts milli to 3d 5h 20m 5s", () => {
    const ms =
      3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 20 * 60 * 1000 + 5 * 1000;
    expect(msToDuration(ms)).toBe("3d 5h 20m 5s");
  });

  it("converts milli to 1d 19h 44m 29s", () => {
    const ms =
      1 * 24 * 60 * 60 * 1000 +
      19 * 60 * 60 * 1000 +
      44 * 60 * 1000 +
      29 * 1000;
    expect(msToDuration(ms)).toBe("1d 19h 44m 29s");
  });

  it("converts milli to 5h 0m", () => {
    const ms = 5 * 60 * 60 * 1000;
    expect(msToDuration(ms)).toBe("5h 0m");
  });

  it("converts milli to 1s", () => {
    const ms = 1 * 1000 + 20;
    expect(msToDuration(ms)).toBe("1s");
  });

  it("converts milli to 12m 12s", () => {
    const ms = 12 * 60 * 1000 + 12 * 1000;
    expect(msToDuration(ms)).toBe("12m 12s");
  });

  it("converts milli to 25s", () => {
    const ms = 25000;
    expect(msToDuration(ms)).toBe("25s");
  });
  it("does not convert milli < 1s", () => {
    const ms = 500;
    expect(msToDuration(ms)).toBe("500ms");
  });
});

describe("getDateCopy", () => {
  it("converts strings to a date with no options", () => {
    expect(getDateCopy("08/31/1996")).toBe("Aug 31, 1996, 12:00:00 AM UTC");
    expect(getDateCopy("12-23-2014")).toBe("Dec 23, 2014, 12:00:00 AM UTC");
    expect(getDateCopy("2020-11-16T22:17:29")).toBe(
      "Nov 16, 2020, 10:17:29 PM UTC",
    );
  });
  it("converts strings with a supplied timezone to the users timezone", () => {
    expect(getDateCopy("2020-11-16T22:17:29z")).toBe(
      "Nov 16, 2020, 10:17:29 PM UTC",
    );
  });
  it("converts date objects to a formatted date with no options", () => {
    expect(getDateCopy(new Date("2020-11-16T22:17:29z"))).toBe(
      "Nov 16, 2020, 10:17:29 PM UTC",
    );
  });
  it("converts date objects to a supplied timezone", () => {
    expect(getDateCopy("2020-11-16T22:17:29", { tz: "America/New_York" })).toBe(
      "Nov 16, 2020, 5:17:29 PM EST",
    );
  });
  it("doesn't return seconds when omitSeconds option is true", () => {
    expect(getDateCopy("2020-11-16T22:17:29", { omitSeconds: true })).toBe(
      "Nov 16, 2020, 10:17 PM UTC",
    );
  });
  it("returns date only when supplied with the option", () => {
    expect(
      getDateCopy(new Date("2020-11-16T22:17:29z"), { dateOnly: true }),
    ).toBe("Nov 16, 2020");
    expect(
      getDateCopy("2020-11-16T22:17:29", {
        tz: "America/New_York",
        dateOnly: true,
      }),
    ).toBe("Nov 16, 2020");
    expect(getDateCopy("08/31/1996", { dateOnly: true })).toBe("Aug 31, 1996");
  });

  it("returns dates in a custom format when supplied with the option", () => {
    expect(
      getDateCopy(new Date("2020-11-16T22:17:29z"), {
        dateFormat: "MM-dd-yyyy",
        dateOnly: true,
      }),
    ).toBe("11-16-2020");
    expect(
      getDateCopy("2020-11-16T22:17:29", {
        tz: "America/New_York",
        dateFormat: "dd-MM-yyyy",
        dateOnly: true,
      }),
    ).toBe("16-11-2020");
    expect(
      getDateCopy("08/31/1996", { dateFormat: "MM/dd/yyyy", dateOnly: true }),
    ).toBe("08/31/1996");
  });

  it("returns dates with a custom time format when supplied with the option", () => {
    expect(
      getDateCopy(new Date("2020-11-16T22:17:29z"), {
        omitTimezone: true,
        timeFormat: TimeFormat.TwentyFourHour,
      }),
    ).toBe("Nov 16, 2020, 22:17:29");

    expect(
      getDateCopy(new Date("2020-11-16T22:17:29z"), {
        omitSeconds: true,
        omitTimezone: true,
        timeFormat: TimeFormat.TwelveHour,
      }),
    ).toBe("Nov 16, 2020, 10:17 PM");
  });
});

describe("applyStrictRegex", () => {
  it("converts string to strict regex", () => {
    expect(applyStrictRegex("dog")).toBe("^dog$");
  });
  it("strict regex works as expected", () => {
    const re = new RegExp(applyStrictRegex("dog"));
    expect("d".match(re)).toBeFalsy();
    expect("do".match(re)).toBeFalsy();
    expect("dog".match(re)).toBeTruthy();
    expect("dog ".match(re)).toBeFalsy();
    expect("adog".match(re)).toBeFalsy();
  });
});

describe("shortenGithash", () => {
  it("shortens githash to 7 characters", () => {
    expect(shortenGithash("01234567")).toBe("0123456");
    expect(shortenGithash("012")).toBe("012");
  });
  it("handles undefined input", () => {
    expect(shortenGithash(undefined)).toBe("");
  });
});

describe("trimStringFromMiddle", () => {
  it("trims middle text according to specified params", () => {
    expect(trimStringFromMiddle("task_name", 4)).toBe("ta…me"); // odd length
    expect(trimStringFromMiddle("task_name2", 4)).toBe("ta…e2"); // even length
  });
  it("doesn't trim middle text if original text is smaller than maxLength specified", () => {
    expect(trimStringFromMiddle("task_name", 10)).toBe("task_name");
  });
});

describe("joinWithConjunction", () => {
  it("creates a list from strings", () => {
    expect(
      joinWithConjunction(["evergreen", "spruce", "app", "plt"], "and"),
    ).toBe("evergreen, spruce, app, and plt");
  });

  it("does not include a comma for a list of two elements", () => {
    expect(joinWithConjunction(["heads", "tails"], "or")).toBe(
      "heads or tails",
    );
  });

  it("handles a list with one element", () => {
    expect(joinWithConjunction(["one"], "and")).toBe("one");
  });

  it("returns an empty string with 0 elements", () => {
    expect(joinWithConjunction([], "or")).toBe("");
  });
});

describe("stripNewLines", () => {
  it("strips new line from string", () => {
    expect(stripNewLines("my\nstring\n")).toBe("mystring");
  });
  it("doesn't strip white space", () => {
    expect(stripNewLines("my \nstring\n")).toBe("my string");
  });
});

describe("getTicketFromJiraURL", () => {
  it("correctly extracts the ticket number from a JIRA URL", () => {
    expect(
      getTicketFromJiraURL("https://jira.mongodb.org/browse/EVG-123"),
    ).toBe("EVG-123");
    expect(
      getTicketFromJiraURL("https://jira.mongodb.org/browse/SOMETHING-12345"),
    ).toBe("SOMETHING-12345");
  });
  it("returns undefined if a ticket number is not found", () => {
    expect(getTicketFromJiraURL("this-is-a-bad-jira-url")).toBeUndefined();
  });
});
