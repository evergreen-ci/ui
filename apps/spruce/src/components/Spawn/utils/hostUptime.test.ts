import {
  getEnabledHoursCount,
  getHostUptimeFromGql,
  getHostUptimeWarnings,
  getNextHostStart,
  getSleepSchedule,
  matchesDefaultUptimeSchedule,
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
    validator(false)(
      {
        expirationDetails: {
          hostUptime: {
            details: {
              timeZone: "America/New_York",
            },
            sleepSchedule: {
              enabledWeekdays: [],
              timeSelection: {
                runContinuously: true,
                startTime: "",
                stopTime: "",
              },
            },
            useDefaultUptimeSchedule: false,
          },
          noExpiration: false,
        },
      },
      {
        expirationDetails: {
          // @ts-expect-error - Partial error schema for test
          hostUptime: { details: { uptimeHours: { addError: f } } },
        },
      },
    );
    expect(f).toHaveBeenCalledTimes(0);
  });

  it("returns error even if beta testing is disabled in form", () => {
    const f = vi.fn();
    validator(false)(
      {
        expirationDetails: {
          hostUptime: {
            details: {
              timeZone: "America/New_York",
            },
            sleepSchedule: {
              enabledWeekdays: [true, true, true, true, true, true, true],
              timeSelection: {
                runContinuously: true,
                startTime: "",
                stopTime: "",
              },
            },
            useDefaultUptimeSchedule: false,
          },
          noExpiration: true,
        },
      },
      {
        expirationDetails: {
          // @ts-expect-error - Partial error schema for test
          hostUptime: { details: { uptimeHours: { addError: f } } },
        },
      },
    );
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("returns error when the host has too many uptime hours", () => {
    const f = vi.fn();
    validator(false)(
      {
        expirationDetails: {
          hostUptime: {
            details: {
              timeZone: "America/New_York",
            },
            sleepSchedule: {
              enabledWeekdays: [true, true, true, true, true, true, true],
              timeSelection: {
                runContinuously: true,
                startTime: "",
                stopTime: "",
              },
            },
            useDefaultUptimeSchedule: false,
          },
          noExpiration: true,
        },
      },
      {
        expirationDetails: {
          // @ts-expect-error - Partial error schema for test
          hostUptime: { details: { uptimeHours: { addError: f } } },
        },
      },
    );
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("does not return an error when the host does not have too many uptime hours", () => {
    const f = vi.fn();
    validator(false)(
      {
        expirationDetails: {
          hostUptime: {
            details: {
              timeZone: "America/New_York",
            },
            sleepSchedule: {
              enabledWeekdays: [false, true, true, true, true, true, false],
              timeSelection: {
                runContinuously: true,
                startTime: "",
                stopTime: "",
              },
            },
            useDefaultUptimeSchedule: false,
          },
          noExpiration: true,
        },
      },
      // @ts-expect-error - Partial error schema for test
      { expirationDetails: { hostUptime: { details: { addError: f } } } },
    );
    expect(f).toHaveBeenCalledTimes(0);
  });

  it("does not add error when host is permanently exempt", () => {
    const f = vi.fn();
    validator(true)(
      {
        expirationDetails: {
          hostUptime: {
            details: {
              timeZone: "America/New_York",
            },
            sleepSchedule: {
              enabledWeekdays: [],
              timeSelection: {
                runContinuously: true,
                startTime: "",
                stopTime: "",
              },
            },
            temporarilyExemptUntil: new Date("2024-01-05").toString(),
            useDefaultUptimeSchedule: false,
          },
          noExpiration: true,
        },
      },
      {
        expirationDetails: {
          // @ts-expect-error - Partial error schema for test
          hostUptime: { temporarilyExemptUntil: { addError: f } },
        },
      },
    );
    expect(f).toHaveBeenCalledTimes(0);
  });

  describe("temporary exemption", () => {
    beforeEach(() => {
      // Hoist date resetting in order to set system-wide date
      // https://github.com/vitest-dev/vitest/issues/5154#issuecomment-1934003114
      vi.hoisted(() => {
        vi.useFakeTimers();
        // Month is 0-indexed (Jan 1 2024)
        const mockDate = new Date(2024, 0, 1);
        vi.setSystemTime(mockDate);
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns an error when exemption is in past", () => {
      const f = vi.fn();
      validator(false)(
        {
          expirationDetails: {
            hostUptime: {
              details: {
                timeZone: "America/New_York",
              },
              sleepSchedule: {
                enabledWeekdays: [],
                timeSelection: {
                  runContinuously: true,
                  startTime: "",
                  stopTime: "",
                },
              },
              temporarilyExemptUntil: new Date("2001-01-01").toString(),
              useDefaultUptimeSchedule: true,
            },
            noExpiration: true,
          },
        },
        {
          expirationDetails: {
            // @ts-expect-error - Partial error schema for test
            hostUptime: { temporarilyExemptUntil: { addError: f } },
          },
        },
      );
      expect(f).toHaveBeenCalledTimes(1);
    });

    it("returns an error when exemption is too long", () => {
      const f = vi.fn();
      validator(false)(
        {
          expirationDetails: {
            hostUptime: {
              details: {
                timeZone: "America/New_York",
              },
              sleepSchedule: {
                enabledWeekdays: [],
                timeSelection: {
                  runContinuously: true,
                  startTime: "",
                  stopTime: "",
                },
              },
              temporarilyExemptUntil: new Date("2025-01-01").toString(),
              useDefaultUptimeSchedule: false,
            },
            noExpiration: true,
          },
        },
        {
          expirationDetails: {
            // @ts-expect-error - Partial error schema for test
            hostUptime: { temporarilyExemptUntil: { addError: f } },
          },
        },
      );
      expect(f).toHaveBeenCalledTimes(1);
    });

    it("does not add error to valid exemption date", () => {
      const f = vi.fn();
      validator(false)(
        {
          expirationDetails: {
            hostUptime: {
              details: {
                timeZone: "America/New_York",
              },
              sleepSchedule: {
                enabledWeekdays: [],
                timeSelection: {
                  runContinuously: true,
                  startTime: "",
                  stopTime: "",
                },
              },
              temporarilyExemptUntil: new Date("2024-01-05").toString(),
              useDefaultUptimeSchedule: false,
            },
            noExpiration: true,
          },
        },
        {
          expirationDetails: {
            // @ts-expect-error - Partial error schema for test
            hostUptime: { temporarilyExemptUntil: { addError: f } },
          },
        },
      );
      expect(f).toHaveBeenCalledTimes(0);
    });
  });
});

describe("getHostUptimeFromGql", () => {
  it("matches default schedule", () => {
    const sched = {
      dailyStartTime: "08:00",
      dailyStopTime: "20:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      temporarilyExemptUntil: null,
      timeZone: "America/New_York",
      wholeWeekdaysOff: [0, 6],
    };
    expect(getHostUptimeFromGql(sched)).toStrictEqual({
      details: {
        timeZone: "America/New_York",
      },
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
      temporarilyExemptUntil: "",
      useDefaultUptimeSchedule: true,
    });
  });

  it("matches alternate schedule", () => {
    const sched = {
      dailyStartTime: "09:00",
      dailyStopTime: "21:00",
      permanentlyExempt: true,
      shouldKeepOff: true,
      temporarilyExemptUntil: new Date("2024-07-01"),
      timeZone: "America/New_York",
      wholeWeekdaysOff: [],
    };
    expect(getHostUptimeFromGql(sched)).toStrictEqual({
      details: {
        timeZone: "America/New_York",
      },
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
      temporarilyExemptUntil:
        "Mon Jul 01 2024 00:00:00 GMT+0000 (Coordinated Universal Time)",
      useDefaultUptimeSchedule: false,
    });
  });

  it("assigns continuous days", () => {
    const sched = {
      dailyStartTime: "",
      dailyStopTime: "",
      permanentlyExempt: true,
      shouldKeepOff: true,
      temporarilyExemptUntil: null,
      timeZone: "America/Chicago",
      wholeWeekdaysOff: [0, 6],
    };
    expect(getHostUptimeFromGql(sched)).toStrictEqual({
      details: {
        timeZone: "America/Chicago",
      },
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
      temporarilyExemptUntil: "",
      useDefaultUptimeSchedule: false,
    });
  });
});

describe("getSleepSchedule", () => {
  it("sets the default schedule", () => {
    expect(
      getSleepSchedule({
        details: {
          timeZone: "America/New_York",
        },
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
        useDefaultUptimeSchedule: true,
      }),
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
      getSleepSchedule({
        details: {
          timeZone: "America/New_York",
        },
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
        useDefaultUptimeSchedule: false,
      }),
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
      getSleepSchedule({
        details: {
          timeZone: "America/New_York",
        },
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
        useDefaultUptimeSchedule: false,
      }),
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

describe("getHostUptimeWarnings", () => {
  it("returns no errors when under recommended time", () => {
    expect(
      getHostUptimeWarnings({
        enabledHoursCount: 60,
        enabledWeekdaysCount: 5,
        runContinuously: false,
      }),
    ).toStrictEqual([]);
  });

  it("returns a warning when over recommended time", () => {
    expect(
      getHostUptimeWarnings({
        enabledHoursCount: 144,
        enabledWeekdaysCount: 6,
        runContinuously: true,
      }),
    ).toStrictEqual(["Consider pausing your host for 2 days per week."]);
  });

  it("does not return a warning when over allowed time", () => {
    expect(
      getHostUptimeWarnings({
        enabledHoursCount: 168,
        enabledWeekdaysCount: 7,
        runContinuously: true,
      }),
    ).toStrictEqual([]);
  });
});

describe("getNextHostStart", () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime("2024-06-02");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates the next start with time", () => {
    const tuesday = new Date("2024-06-04T08:00").toString();
    expect(getNextHostStart("08:00", tuesday)).toStrictEqual({
      nextStartDay: "Tuesday",
      nextStartTime: "8:00",
    });
  });

  it("calculates starting tomorrow with time", () => {
    const monday = new Date("2024-06-03T08:00").toString();
    expect(getNextHostStart("08:00", monday)).toStrictEqual({
      nextStartDay: "tomorrow",
      nextStartTime: "8:00",
    });
  });

  it("calculates the next start when running continuously", () => {
    const tuesday = new Date("2024-06-04T08:00").toString();
    expect(getNextHostStart("", tuesday)).toStrictEqual({
      nextStartDay: "Tuesday",
      nextStartTime: null,
    });
  });
});

describe("getEnabledHoursCount", () => {
  it("calculates uptime for default schedule", () => {
    expect(
      getEnabledHoursCount({
        details: {
          timeZone: "America/New_York",
        },
        sleepSchedule: {
          enabledWeekdays: [],
          timeSelection: {
            runContinuously: true,
            startTime: "",
            stopTime: "",
          },
        },
        useDefaultUptimeSchedule: true,
      }),
    ).toStrictEqual({
      enabledHoursCount: 60,
      enabledWeekdaysCount: 5,
    });
  });

  it("calculates uptime for custom schedule", () => {
    expect(
      getEnabledHoursCount({
        details: {
          timeZone: "America/New_York",
        },
        sleepSchedule: {
          enabledWeekdays: [false, true, true, true, true, true, false],
          timeSelection: {
            runContinuously: false,
            startTime:
              "Mon Jan 01 1900 07:00:00 GMT+0000 (Coordinated Universal Time)",
            stopTime:
              "Mon Jan 01 1900 20:00:00 GMT+0000 (Coordinated Universal Time)",
          },
        },
        useDefaultUptimeSchedule: false,
      }),
    ).toStrictEqual({
      enabledHoursCount: 65,
      enabledWeekdaysCount: 5,
    });
  });

  it("calculates uptime for continuously running schedule", () => {
    expect(
      getEnabledHoursCount({
        details: {
          timeZone: "America/New_York",
        },
        sleepSchedule: {
          enabledWeekdays: [false, true, true, true, true, true, false],
          timeSelection: {
            runContinuously: true,
            startTime: "",
            stopTime: "",
          },
        },
        useDefaultUptimeSchedule: false,
      }),
    ).toStrictEqual({
      enabledHoursCount: 120,
      enabledWeekdaysCount: 5,
    });
  });

  it("calculates uptime for overnight schedule", () => {
    expect(
      getEnabledHoursCount({
        details: {
          timeZone: "America/New_York",
        },
        sleepSchedule: {
          enabledWeekdays: [false, true, true, true, true, true, false],
          timeSelection: {
            runContinuously: false,
            startTime:
              "Mon Jan 01 1900 20:00:00 GMT+0000 (Coordinated Universal Time)",
            stopTime:
              "Mon Jan 01 1900 03:00:00 GMT+0000 (Coordinated Universal Time)",
          },
        },
        useDefaultUptimeSchedule: false,
      }),
    ).toStrictEqual({
      enabledHoursCount: 35,
      enabledWeekdaysCount: 5,
    });
  });
});
