import { getWidgetLabel } from "./utils";

describe("getWidgetLabel", () => {
  it("prefers an explicit UI-schema title", () => {
    expect(
      getWidgetLabel(
        "generated label",
        { title: "schema title" },
        { "ui:title": "UI title" },
      ),
    ).toBe("UI title");
  });

  it("uses the schema title before the generated label", () => {
    expect(getWidgetLabel("generated label", { title: "schema title" })).toBe(
      "schema title",
    );
  });

  it("falls back to the generated label", () => {
    expect(getWidgetLabel("generated label", {})).toBe("generated label");
  });
});
