import { CaseSensitivity, MatchType } from "constants/enums";
import {
  parseFilter,
  parseFilters,
  stringifyFilter,
  stringifyFilters,
} from ".";

describe("filters", () => {
  describe("stringifyFilter", () => {
    it("can handle empty input", () => {
      expect(
        stringifyFilter({
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "",
          matchType: MatchType.Exact,
          visible: false,
        }),
      ).toStrictEqual("000");
    });
    it("can handle a single filter", () => {
      expect(
        stringifyFilter({
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "hello-i-am-a-filter",
          matchType: MatchType.Exact,
          visible: true,
        }),
      ).toStrictEqual("100hello-i-am-a-filter");
    });
  });
  describe("stringifyFilters", () => {
    it("can handle empty input", () => {
      expect(stringifyFilters([])).toStrictEqual([]);
    });
    it("stringifies a single filter correctly", () => {
      expect(
        stringifyFilters([
          {
            caseSensitive: CaseSensitivity.Insensitive,
            expression: "hello-i-am-a-filter",
            matchType: MatchType.Exact,
            visible: true,
          },
        ]),
      ).toStrictEqual(["100hello-i-am-a-filter"]);
    });
    it("stringifies multiple filters correctly", () => {
      expect(
        stringifyFilters([
          {
            caseSensitive: CaseSensitivity.Sensitive,
            expression: "passed",
            matchType: MatchType.Inverse,
            visible: false,
          },
          {
            caseSensitive: CaseSensitivity.Insensitive,
            expression: "failed",
            matchType: MatchType.Inverse,
            visible: true,
          },
          {
            caseSensitive: CaseSensitivity.Sensitive,
            expression: "running",
            matchType: MatchType.Exact,
            visible: false,
          },
        ]),
      ).toStrictEqual(["011passed", "101failed", "010running"]);
    });
    it("successfully encodes special characters", () => {
      expect(
        stringifyFilters([
          {
            caseSensitive: CaseSensitivity.Insensitive,
            expression: "ran in d{3,}",
            matchType: MatchType.Exact,
            visible: true,
          },
        ]),
      ).toStrictEqual(["100ran%20in%20d%7B3%2C%7D"]);
    });
  });
  describe("parseFilter", () => {
    it("can handle empty input", () => {
      expect(parseFilter("")).toStrictEqual({
        caseSensitive: CaseSensitivity.Insensitive,
        expression: "",
        matchType: MatchType.Exact,
        visible: false,
      });
    });
    it("can handle a single filter", () => {
      expect(parseFilter("100hello-i-am-a-filter")).toStrictEqual({
        caseSensitive: CaseSensitivity.Insensitive,
        expression: "hello-i-am-a-filter",
        matchType: MatchType.Exact,
        visible: true,
      });
    });
  });
  describe("parseFilters", () => {
    it("can handle empty input", () => {
      expect(parseFilters([])).toStrictEqual([]);
    });
    it("parses a single filter correctly", () => {
      expect(parseFilters(["100hello-i-am-a-filter"])).toStrictEqual([
        {
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "hello-i-am-a-filter",
          matchType: MatchType.Exact,
          visible: true,
        },
      ]);
    });
    it("parses a single filter that resembles a number correctly", () => {
      expect(parseFilters(["10012345"])).toStrictEqual([
        {
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "12345",
          matchType: MatchType.Exact,
          visible: true,
        },
      ]);
    });
    it("successfully decodes special characters", () => {
      expect(parseFilters(["100ran%20in%20d%7B3%2C%7D"])).toStrictEqual([
        {
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "ran in d{3,}",
          matchType: MatchType.Exact,
          visible: true,
        },
      ]);
    });
    it("parses multiple filters correctly", () => {
      expect(
        parseFilters(["011passed", "101failed", "010running"]),
      ).toStrictEqual([
        {
          caseSensitive: CaseSensitivity.Sensitive,
          expression: "passed",
          matchType: MatchType.Inverse,
          visible: false,
        },
        {
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "failed",
          matchType: MatchType.Inverse,
          visible: true,
        },
        {
          caseSensitive: CaseSensitivity.Sensitive,
          expression: "running",
          matchType: MatchType.Exact,
          visible: false,
        },
      ]);
    });
  });
});
