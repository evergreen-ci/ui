import { ansiToJiraColorMarkup } from "./ansiToJira";

describe("ansiToJiraColorMarkup", () => {
  it("should return lines without ANSI escape codes unchanged", () => {
    expect(ansiToJiraColorMarkup("plain log line")).toBe("plain log line");
    expect(ansiToJiraColorMarkup("")).toBe("");
  });

  it("should convert standard foreground colors to JIRA color tags", () => {
    expect(ansiToJiraColorMarkup("[31mremoved[39m [32madded[39m")).toBe(
      "{color:#BB0000}removed{color} {color:#00BB00}added{color}",
    );
  });

  it("should treat a full reset as the end of a colored run", () => {
    expect(ansiToJiraColorMarkup("[34mblue[0m and plain")).toBe(
      "{color:#0000BB}blue{color} and plain",
    );
  });

  it("should convert bright foreground colors", () => {
    expect(ansiToJiraColorMarkup("[91mbright red[39m")).toBe(
      "{color:#FF5555}bright red{color}",
    );
  });

  it("should convert 256-color palette codes", () => {
    expect(ansiToJiraColorMarkup("[38;5;1mred[39m")).toBe(
      "{color:#BB0000}red{color}",
    );
    expect(ansiToJiraColorMarkup("[38;5;196mred cube[39m")).toBe(
      "{color:#FF0000}red cube{color}",
    );
    expect(ansiToJiraColorMarkup("[38;5;244mgrey[39m")).toBe(
      "{color:#808080}grey{color}",
    );
  });

  it("should convert truecolor codes", () => {
    expect(ansiToJiraColorMarkup("[38;2;1;2;3mcustom[39m")).toBe(
      "{color:#010203}custom{color}",
    );
  });

  it("should strip style-only codes without adding color tags", () => {
    expect(ansiToJiraColorMarkup("[1mbold[22m")).toBe("bold");
    expect(ansiToJiraColorMarkup("[4m[1mboth[22m[24m")).toBe("both");
  });

  it("should not split a colored run on style codes within it", () => {
    expect(ansiToJiraColorMarkup("[32mgreen [1mbold green[39m")).toBe(
      "{color:#00BB00}green bold green{color}",
    );
  });

  it("should ignore background colors", () => {
    expect(ansiToJiraColorMarkup("[41mred background[49m")).toBe(
      "red background",
    );
    expect(ansiToJiraColorMarkup("[48;5;196mred background[49m")).toBe(
      "red background",
    );
  });

  it("should close an unterminated color at the end of the line", () => {
    expect(ansiToJiraColorMarkup("[33mstill yellow")).toBe(
      "{color:#BBBB00}still yellow{color}",
    );
  });

  it("should treat an empty SGR sequence as a reset", () => {
    expect(ansiToJiraColorMarkup("[36mcyan[mplain")).toBe(
      "{color:#00BBBB}cyan{color}plain",
    );
  });

  it("should strip non-SGR escape sequences", () => {
    expect(ansiToJiraColorMarkup("[2Kerased line")).toBe("erased line");
  });
});
