import {
  getBytesAsString,
  getJiraFormat,
  getRawLines,
  isFailingLine,
  stringIntersection,
  trimSeverity,
} from ".";

describe("getRawLines", () => {
  const logLines = ["zero", "one", "two", "three", "four", "five"];
  const getLine = (lineNumber: number) => logLines[lineNumber];

  it("should add an ellipsis between lines if they are not adjacent to each other", () => {
    const bookmarks = [0, 5];
    expect(getRawLines(bookmarks, getLine)).toBe(
      `${logLines[0]}\n...\n${logLines[5]}\n`,
    );
  });

  it("should not add an ellipsis if the lines are adjacent", () => {
    const bookmarks = [0, 1];
    expect(getRawLines(bookmarks, getLine)).toBe(
      `${logLines[0]}\n${logLines[1]}\n`,
    );
  });

  it("should return an empty string when there are no bookmarks", () => {
    const bookmarks: number[] = [];
    expect(getRawLines(bookmarks, getLine)).toBe("");
  });

  it("should handle out of bounds bookmarks", () => {
    const bookmarks = [6];
    expect(getRawLines(bookmarks, getLine)).toBe(``);
  });
});

describe("getJiraFormat", () => {
  const logLines = ["zero", "one", "two", "three", "four", "five"];
  const getLine = (lineNumber: number) => logLines[lineNumber];

  it("should add an ellipsis between lines if they are not adjacent to each other", () => {
    const bookmarks = [0, 5];
    expect(getJiraFormat(bookmarks, getLine)).toBe(
      `{noformat}\n${logLines[0]}\n...\n${logLines[5]}\n{noformat}`,
    );
  });

  it("should not add an ellipsis if the lines are adjacent", () => {
    const bookmarks = [0, 1];
    expect(getJiraFormat(bookmarks, getLine)).toBe(
      `{noformat}\n${logLines[0]}\n${logLines[1]}\n{noformat}`,
    );
  });

  it("should return an empty string when there are no bookmarks", () => {
    const bookmarks: number[] = [];
    expect(getJiraFormat(bookmarks, getLine)).toBe("");
  });

  it("should handle out of bounds bookmarks", () => {
    const bookmarks = [6];
    expect(getJiraFormat(bookmarks, getLine)).toBe(`{noformat}\n{noformat}`);
  });

  it("should properly format the JIRA string", () => {
    const bookmarks = [0, 2, 4, 5];
    expect(getJiraFormat(bookmarks, getLine)).toBe(
      `{noformat}\n${logLines[0]}\n...\n${logLines[2]}\n...\n${logLines[4]}\n${logLines[5]}\n{noformat}`,
    );
  });
});

describe("stringIntersection", () => {
  it("should return true if strings have any intersection", () => {
    expect(stringIntersection("abc", "bc")).toBeTruthy();
    expect(stringIntersection("bc", "abc")).toBeTruthy();
  });
  it("should return false if there isn't any overlap between the strings", () => {
    expect(stringIntersection("abc", "def")).toBeFalsy();
    expect(stringIntersection("def", "abc")).toBeFalsy();
  });
  it("should return false if there is only a partial overlap", () => {
    expect(stringIntersection("abc", "bcd")).toBeFalsy();
  });
});

describe("getBytesAsString", () => {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;
  it("should return 0 Bytes for 0 bytes", () => {
    expect(getBytesAsString(0)).toBe("0 Bytes");
  });
  it("should format file size in the correct unit", () => {
    expect(getBytesAsString(1 * kb)).toBe("1 KB");
    expect(getBytesAsString(1 * mb)).toBe("1 MB");
    expect(getBytesAsString(1 * gb)).toBe("1 GB");
  });
  describe("should format file size in the correct unit with the correct level of precision", () => {
    it("kilobytes", () => {
      expect(getBytesAsString(kb + kb / 2, 0)).toBe("2 KB");
      expect(getBytesAsString(kb + kb / 2, 1)).toBe("1.5 KB");
      expect(getBytesAsString(kb + kb / 3, 2)).toBe("1.33 KB");
    });
    it("megabytes", () => {
      expect(getBytesAsString(mb + mb / 2, 0)).toBe("2 MB");
      expect(getBytesAsString(mb + mb / 2, 1)).toBe("1.5 MB");
      expect(getBytesAsString(mb + mb / 3, 2)).toBe("1.33 MB");
    });
    it("gigabytes", () => {
      expect(getBytesAsString(gb + gb / 2, 0)).toBe("2 GB");
      expect(getBytesAsString(gb + gb / 2, 1)).toBe("1.5 GB");
      expect(getBytesAsString(gb + gb / 3, 2)).toBe("1.33 GB");
    });
  });
});

describe("trimSeverity", () => {
  it("should trim the severity prefix from a line", () => {
    expect(
      trimSeverity(
        "[P: 40] [2022/12/05 20:03:30.136] Running pre-task commands.",
      ),
    ).toBe("[2022/12/05 20:03:30.136] Running pre-task commands.");
    expect(
      trimSeverity(
        "[P: 70] [2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
      ),
    ).toBe(
      "[2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
    );
  });
  it("should not trim the string if the severity prefix is not present", () => {
    expect(
      trimSeverity("[2022/12/05 20:03:30.136] Running pre-task commands."),
    ).toBe("[2022/12/05 20:03:30.136] Running pre-task commands.");
    expect(
      trimSeverity(
        "[2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
      ),
    ).toBe(
      "[2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
    );
  });
});

describe("isFailingLine", () => {
  it("should return true for a failing line", () => {
    expect(
      isFailingLine(
        "[2023/01/02 10:42:29.414] Command 'subprocess.exec' in function 'run-evergreen' (step 1.3 of 4) failed: process encountered problem: exit code 2.",
        "'subprocess.exec' in function 'run-evergreen' (step 1.3 of 4)",
      ),
    ).toBe(true);
    expect(
      isFailingLine(
        "[2023/01/02 10:42:29.414] Command 'shell.exec' in function 'cypress-test' (step 7.5 of 9) stopped early: context canceled.",
        "'shell.exec' in function 'cypress-test' (step 7.5 of 9)",
      ),
    ).toBe(true);
    expect(
      isFailingLine(
        "[2023/01/02 10:42:29.414] Command 'shell.exec' in function 'attach-cypress-results' (step 3.3 of 8) in block 'post' failed: shell script encountered problem: exit code 1.",
        "'shell.exec' in function 'attach-cypress-results' (step 3.3 of 8) in block 'post'",
      ),
    ).toBe(true);
    expect(
      isFailingLine(
        "[2023/01/02 10:42:29.414] Finished command 'shell.exec' in function 'check-codegen' (step 2 of 2).",
        "'shell.exec' in function 'check-codegen' (step 2 of 2)",
      ),
    ).toBe(true);
  });
  it("should return false if not a failing line", () => {
    expect(
      isFailingLine(
        "[2023/01/02 10:42:29.414] Running command 'shell.exec' in function 'check-codegen' (step 2 of 2).",
        "'shell.exec' in function 'check-codegen' (step 2 of 2)",
      ),
    ).toBe(false);
    expect(
      isFailingLine(
        "[2023/01/02 10:42:29.414] Running command 'shell.exec' in function 'check-codegen' (step 2 of 2).",
        "'shell.exec' in function 'check-codegen' (step 2 of 2)",
      ),
    ).toBe(false);
  });
});
