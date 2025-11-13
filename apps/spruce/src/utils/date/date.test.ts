import { getUTCEndOfDay } from ".";

describe("getUTCEndOfDay", () => {
  beforeEach(() => {
    process.env.TZ = "America/New_York";
  });

  afterEach(() => {
    process.env.TZ = "UTC";
  });

  it("returns undefined if date is null", () => {
    const res = getUTCEndOfDay(null);
    expect(res).toBeUndefined();
  });

  it("calculates the correct date", () => {
    let res = getUTCEndOfDay("2025-04-05", "Asia/Seoul");
    expect(res).toStrictEqual(new Date("2025-04-05T14:59:59.000Z"));

    res = getUTCEndOfDay("2025-04-05", "Pacific/Tahiti");
    expect(res).toStrictEqual(new Date("2025-04-06T09:59:59.000Z"));

    res = getUTCEndOfDay("2025-04-05", "Atlantic/Reykjavik");
    expect(res).toStrictEqual(new Date("2025-04-05T23:59:59.000Z"));

    res = getUTCEndOfDay("2025-04-05");
    expect(res).toStrictEqual(new Date("2025-04-06T03:59:59.000Z"));
  });
});
