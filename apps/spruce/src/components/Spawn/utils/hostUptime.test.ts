import {
  getHostUptimeFromGql,
  getSleepSchedule,
  matchesDefaultUptimeSchedule,
  validateUptimeSchedule,
  validator,
} from "./hostUptime";

describe("matchesDefaultUptimeSchedule", () => {
  it("correctly identifies a match", () => {
    const sched = {
      dailyStartTime: "08:00",
      dailyStopTime: "20:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 6],
    };
    expect(matchesDefaultUptimeSchedule(sched)).toBe(true);
  });

  it("fails when start time is incorrect", () => {
    const sched = {
      dailyStartTime: "08:30",
      dailyStopTime: "20:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 6],
    };
    expect(matchesDefaultUptimeSchedule(sched)).toBe(false);
  });

  it("fails when stop time is incorrect", () => {
    const sched = {
      dailyStartTime: "08:00",
      dailyStopTime: "21:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 6],
    };
    expect(matchesDefaultUptimeSchedule(sched)).toBe(false);
  });

  it("fails when days off is incorrect", () => {
    const sched = {
      dailyStartTime: "08:00",
      dailyStopTime: "20:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0],
    };
    expect(matchesDefaultUptimeSchedule(sched)).toBe(false);
  });
});

describe("validator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns no errors when host is expirable", () => {
    const f = vi.fn();
    validator(
      {
        expirationDetails: {
          hostUptime: {
            useDefaultUptimeSchedule: false,
            sleepSchedule: {
              enabledWeekdays: [],
              timeSelection: {
                startTime: "",
                stopTime: "",
                runContinuously: true,
              },
            },
          },
          noExpiration: false,
        },
      },
      // @ts-expect-error
      { expirationDetails: { hostUptime: { addError: f } } },
    );
    expect(f).toHaveBeenCalledTimes(0);
  });

  it("returns error when the host has too many uptime hours", () => {
    const f = vi.fn();
    validator(
      {
        expirationDetails: {
          hostUptime: {
            useDefaultUptimeSchedule: false,
            sleepSchedule: {
              enabledWeekdays: [true, true, true, true, true, true, true],
              timeSelection: {
                startTime: "",
                stopTime: "",
                runContinuously: true,
              },
            },
          },
          noExpiration: true,
        },
      },
      // @ts-expect-error
      { expirationDetails: { hostUptime: { addError: f } } },
    );
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("does not return an error when the host does not have too many uptime hours", () => {
    const f = vi.fn();
    validator(
      {
        expirationDetails: {
          hostUptime: {
            useDefaultUptimeSchedule: false,
            sleepSchedule: {
              enabledWeekdays: [false, true, true, true, true, true, false],
              timeSelection: {
                startTime: "",
                stopTime: "",
                runContinuously: true,
              },
            },
          },
          noExpiration: true,
        },
      },
      // @ts-expect-error
      { expirationDetails: { hostUptime: { addError: f } } },
    );
    expect(f).toHaveBeenCalledTimes(0);
  });
});

describe("getHostUptimeFromGql", () => {
  it("matches default schedule", () => {
    const sched = {
      dailyStartTime: "08:00",
      dailyStopTime: "20:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 6],
    };
    expect(getHostUptimeFromGql(sched)).toStrictEqual({
      sleepSchedule: {
        enabledWeekdays: [false, true, true, true, true, true, false],
        timeSelection: {
          runContinuously: false,
          startTime:
            "Mon Jan 01 1900 08:00:00 GMT+0000 (Coordinated Universal Time)",
          stopTime:
            "Mon Jan 01 1900 20:00:00 GMT+0000 (Coordinated Universal Time)",
        },
      },
      useDefaultUptimeSchedule: true,
    });
  });

  it("matches alternate schedule", () => {
    const sched = {
      dailyStartTime: "09:00",
      dailyStopTime: "21:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [],
    };
    expect(getHostUptimeFromGql(sched)).toStrictEqual({
      useDefaultUptimeSchedule: false,
      sleepSchedule: {
        enabledWeekdays: [true, true, true, true, true, true, true],
        timeSelection: {
          runContinuously: false,
          startTime:
            "Mon Jan 01 1900 09:00:00 GMT+0000 (Coordinated Universal Time)",
          stopTime:
            "Mon Jan 01 1900 21:00:00 GMT+0000 (Coordinated Universal Time)",
        },
      },
    });
  });

  it("assigns continuous days", () => {
    const sched = {
      dailyStartTime: "",
      dailyStopTime: "",
      permanentlyExempt: true,
      shouldKeepOff: true,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 6],
    };
    expect(getHostUptimeFromGql(sched)).toStrictEqual({
      useDefaultUptimeSchedule: false,
      sleepSchedule: {
        enabledWeekdays: [false, true, true, true, true, true, false],
        timeSelection: {
          runContinuously: true,
          startTime:
            "Sun Dec 31 1899 08:00:00 GMT+0000 (Coordinated Universal Time)",
          stopTime:
            "Sun Dec 31 1899 20:00:00 GMT+0000 (Coordinated Universal Time)",
        },
      },
    });
  });
});

describe("getSleepSchedule", () => {
  it("sets the default schedule", () => {
    expect(
      getSleepSchedule({ useDefaultUptimeSchedule: true }, "America/New_York"),
    ).toStrictEqual({
      dailyStartTime: "08:00",
      dailyStopTime: "20:00",
      permanentlyExempt: false,
      shouldKeepOff: false,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 6],
    });
  });

  it("sets continuously running days", () => {
    expect(
      getSleepSchedule(
        {
          useDefaultUptimeSchedule: false,
          sleepSchedule: {
            enabledWeekdays: [false, false, true, true, true, true, false],
            timeSelection: {
              runContinuously: true,
              startTime:
                "Sun Dec 31 1899 08:00:00 GMT+0000 (Coordinated Universal Time)",
              stopTime:
                "Sun Dec 31 1899 20:00:00 GMT+0000 (Coordinated Universal Time)",
            },
          },
        },
        "America/New_York",
      ),
    ).toStrictEqual({
      dailyStartTime: "",
      dailyStopTime: "",
      permanentlyExempt: false,
      shouldKeepOff: false,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 1, 6],
    });
  });

  it("sets start and stop times", () => {
    expect(
      getSleepSchedule(
        {
          useDefaultUptimeSchedule: false,
          sleepSchedule: {
            enabledWeekdays: [false, false, true, true, true, true, false],
            timeSelection: {
              runContinuously: false,
              startTime:
                "Sun Dec 31 1899 08:00:00 GMT+0000 (Coordinated Universal Time)",
              stopTime:
                "Sun Dec 31 1899 20:00:00 GMT+0000 (Coordinated Universal Time)",
            },
          },
        },
        "America/New_York",
      ),
    ).toStrictEqual({
      dailyStartTime: "08:00",
      dailyStopTime: "20:00",
      permanentlyExempt: false,
      shouldKeepOff: false,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 1, 6],
    });
  });
});

describe("validateUptimeSchedule", () => {
  it("returns no errors when under recommended time", () => {
    expect(
      validateUptimeSchedule({
        enabledWeekdays: [false, false, true, true, true, true, false],
        runContinuously: false,
        startTime:
          "Sun Dec 31 1899 08:00:00 GMT+0000 (Coordinated Universal Time)",
        stopTime:
          "Sun Dec 31 1899 20:00:00 GMT+0000 (Coordinated Universal Time)",
        useDefaultUptimeSchedule: true,
      }),
    ).toStrictEqual({
      enabledHoursCount: 60,
      errors: [],
      warnings: [],
    });
  });

  it("returns a warning when over recommended time", () => {
    expect(
      validateUptimeSchedule({
        enabledWeekdays: [false, true, true, true, true, true, true],
        runContinuously: true,
        startTime:
          "Sun Dec 31 1899 08:00:00 GMT+0000 (Coordinated Universal Time)",
        stopTime:
          "Sun Dec 31 1899 20:00:00 GMT+0000 (Coordinated Universal Time)",
        useDefaultUptimeSchedule: false,
      }),
    ).toStrictEqual({
      enabledHoursCount: 144,
      errors: [],
      warnings: ["Consider pausing your host for 2 days per week."],
    });
  });

  it("returns an error when over allowed time", () => {
    expect(
      validateUptimeSchedule({
        enabledWeekdays: [true, true, true, true, true, true, true],
        runContinuously: true,
        startTime:
          "Sun Dec 31 1899 08:00:00 GMT+0000 (Coordinated Universal Time)",
        stopTime:
          "Sun Dec 31 1899 20:00:00 GMT+0000 (Coordinated Universal Time)",
        useDefaultUptimeSchedule: false,
      }),
    ).toStrictEqual({
      enabledHoursCount: 168,
      errors: ["Please pause your host for at least 1 day per week."],
      warnings: [],
    });
  });
});
