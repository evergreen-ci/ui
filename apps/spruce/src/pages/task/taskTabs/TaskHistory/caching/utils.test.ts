import { tasks } from "../testData";
import { isAllInactive } from "./utils";

// @ts-expect-error: no need to type the args for this mock.
const readField = (field, obj) => obj[field];

describe("isAllInactive", () => {
  it("returns false if tasks are not all inactive", () => {
    expect(isAllInactive(tasks, readField)).toBe(false);
  });

  it("returns true if tasks are all inactive", () => {
    expect(isAllInactive(tasks.slice(6, 9), readField)).toBe(true);
  });
});
