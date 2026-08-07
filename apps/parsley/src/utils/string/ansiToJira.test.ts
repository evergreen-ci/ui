import { ansiToJiraColorMarkup } from "./ansiToJira";

describe("ansiToJiraColorMarkup", () => {
  it("should return lines without ANSI escape codes unchanged", () => {
    expect(ansiToJiraColorMarkup("plain log line")).toBe("plain log line");
    expect(ansiToJiraColorMarkup("")).toBe("");
  });

  it("should convert standard foreground colors to JIRA color tags", () => {
    expect(
      ansiToJiraColorMarkup(
        "\u001b[31mremoved\u001b[39m \u001b[32madded\u001b[39m",
      ),
    ).toBe("{color:#BB0000}removed{color} {color:#00BB00}added{color}");
  });

  it("should treat a full reset as the end of a colored run", () => {
    expect(ansiToJiraColorMarkup("\u001b[34mblue\u001b[0m and plain")).toBe(
      "{color:#0000BB}blue{color} and plain",
    );
  });

  it("should convert bright foreground colors", () => {
    expect(ansiToJiraColorMarkup("\u001b[91mbright red\u001b[39m")).toBe(
      "{color:#FF5555}bright red{color}",
    );
  });

  it("should convert 256-color palette codes", () => {
    expect(ansiToJiraColorMarkup("\u001b[38;5;1mred\u001b[39m")).toBe(
      "{color:#BB0000}red{color}",
    );
    expect(ansiToJiraColorMarkup("\u001b[38;5;196mred cube\u001b[39m")).toBe(
      "{color:#FF0000}red cube{color}",
    );
    expect(ansiToJiraColorMarkup("\u001b[38;5;244mgrey\u001b[39m")).toBe(
      "{color:#808080}grey{color}",
    );
  });

  it("should convert truecolor codes", () => {
    expect(ansiToJiraColorMarkup("\u001b[38;2;1;2;3mcustom\u001b[39m")).toBe(
      "{color:#010203}custom{color}",
    );
  });

  it("should strip style-only codes without adding color tags", () => {
    expect(ansiToJiraColorMarkup("\u001b[1mbold\u001b[22m")).toBe("bold");
    expect(
      ansiToJiraColorMarkup("\u001b[4m\u001b[1mboth\u001b[22m\u001b[24m"),
    ).toBe("both");
  });

  it("should not split a colored run on style codes within it", () => {
    expect(
      ansiToJiraColorMarkup("\u001b[32mgreen \u001b[1mbold green\u001b[39m"),
    ).toBe("{color:#00BB00}green bold green{color}");
  });

  it("should convert multiple colors with combined style codes", () => {
    expect(
      ansiToJiraColorMarkup(
        "␛[32;1mcypress:server:appdata ␛[0mpath: /home/ec2-user/.config/Cypress/cy/production/browsers ␛[32m+0ms␛[0m",
      ),
    ).toBe(
      "{color:#00BB00}cypress:server:appdata {color}path: /home/ec2-user/.config/Cypress/cy/production/browsers {color:#00BB00}+0ms{color}",
    );
  });

  it("should ignore background colors", () => {
    expect(ansiToJiraColorMarkup("\u001b[41mred background\u001b[49m")).toBe(
      "red background",
    );
    expect(
      ansiToJiraColorMarkup("\u001b[48;5;196mred background\u001b[49m"),
    ).toBe("red background");
  });

  it("should close an unterminated color at the end of the line", () => {
    expect(ansiToJiraColorMarkup("\u001b[33mstill yellow")).toBe(
      "{color:#BBBB00}still yellow{color}",
    );
  });

  it("should treat an empty SGR sequence as a reset", () => {
    expect(ansiToJiraColorMarkup("\u001b[36mcyan\u001b[mplain")).toBe(
      "{color:#00BBBB}cyan{color}plain",
    );
  });

  it("should strip non-SGR escape sequences", () => {
    expect(ansiToJiraColorMarkup("\u001b[2Kerased line")).toBe("erased line");
  });
});
