import stripAnsi from "strip-ansi";

// Hex values mirror ansi_up's default palette so that copied colors match
// what Parsley renders.
const STANDARD_COLORS = [
  "#000000",
  "#BB0000",
  "#00BB00",
  "#BBBB00",
  "#0000BB",
  "#BB00BB",
  "#00BBBB",
  "#FFFFFF",
];

const BRIGHT_COLORS = [
  "#555555",
  "#FF5555",
  "#00FF00",
  "#FFFF55",
  "#5555FF",
  "#FF55FF",
  "#55FFFF",
  "#FFFFFF",
];

const CUBE_LEVELS = [0, 95, 135, 175, 215, 255];

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, channel)).toString(16).padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;

const xterm256ToHex = (paletteIndex: number) => {
  if (paletteIndex < 0) {
    return undefined;
  }
  if (paletteIndex < 8) {
    return STANDARD_COLORS[paletteIndex];
  }
  if (paletteIndex < 16) {
    return BRIGHT_COLORS[paletteIndex - 8];
  }
  if (paletteIndex < 232) {
    const cubeIndex = paletteIndex - 16;
    return rgbToHex(
      CUBE_LEVELS[Math.floor(cubeIndex / 36)],
      CUBE_LEVELS[Math.floor(cubeIndex / 6) % 6],
      CUBE_LEVELS[cubeIndex % 6],
    );
  }
  if (paletteIndex < 256) {
    const grey = 8 + (paletteIndex - 232) * 10;
    return rgbToHex(grey, grey, grey);
  }
  return undefined;
};

const applySgrParams = (
  params: string,
  currentColor: string | undefined,
): string | undefined => {
  // An empty parameter list (e.g. "[m") is equivalent to a reset.
  const codes = params === "" ? [0] : params.split(";").map(Number);
  let color = currentColor;
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    if (code === 0 || code === 39) {
      color = undefined;
    } else if (code >= 30 && code <= 37) {
      color = STANDARD_COLORS[code - 30];
    } else if (code >= 90 && code <= 97) {
      color = BRIGHT_COLORS[code - 90];
    } else if (code === 38 || code === 48) {
      // Extended color sequences consume a variable number of parameters, so
      // they must be skipped over even for background (48) colors to avoid
      // misreading their arguments as standalone codes.
      const isForeground = code === 38;
      if (codes[i + 1] === 5 && codes.length > i + 2) {
        if (isForeground) {
          color = xterm256ToHex(codes[i + 2]) ?? color;
        }
        i += 2;
      } else if (codes[i + 1] === 2 && codes.length > i + 4) {
        if (isForeground) {
          color = rgbToHex(codes[i + 2], codes[i + 3], codes[i + 4]);
        }
        i += 4;
      } else {
        break;
      }
    }
  }
  return color;
};

// eslint-disable-next-line no-control-regex
const SGR_REGEX = /\[([0-9;]*)m/g;

/**
 * `ansiToJiraColorMarkup` translates ANSI foreground color escape codes in a
 * log line into JIRA `{color:#hex}text{color}` markup and strips all other
 * escape sequences. Each line is processed independently, matching how
 * Parsley renders ANSI colors, so any color still active at the end of the
 * line is closed.
 * @param line - log line that may contain ANSI escape sequences
 * @returns the line with ANSI colors rewritten as JIRA color tags
 */
export const ansiToJiraColorMarkup = (line: string): string => {
  if (!line.includes("")) {
    return line;
  }

  const runs: { text: string; color: string | undefined }[] = [];
  let color: string | undefined;
  let cursor = 0;

  const pushRun = (rawText: string) => {
    // Remove non-SGR escape sequences (cursor movement, links, etc.).
    const text = stripAnsi(rawText);
    if (text.length === 0) {
      return;
    }
    const lastRun = runs[runs.length - 1];
    if (lastRun && lastRun.color === color) {
      lastRun.text += text;
    } else {
      runs.push({ color, text });
    }
  };

  for (const match of line.matchAll(SGR_REGEX)) {
    pushRun(line.slice(cursor, match.index));
    cursor = match.index + match[0].length;
    color = applySgrParams(match[1], color);
  }
  pushRun(line.slice(cursor));

  return runs
    .map((run) =>
      run.color ? `{color:${run.color}}${run.text}{color}` : run.text,
    )
    .join("");
};
