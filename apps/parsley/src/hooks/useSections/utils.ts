import { Range } from "types/logs";
import { includesLineNumber } from "utils/logRow";
import { trimSeverity } from "utils/string";
import { SectionState } from ".";

enum SectionStatus {
  Running = "Running",
  Finished = "Finished",
}

interface SectionLineMetadata {
  commandName: string;
  functionName: string;
  status: SectionStatus;
  step: string;
}
/**
 * `processLine` parses a log line to extract metadata about a section entry.
 * @param str - The log line to be processed.
 * @returns The metadata about the section entry
 * or null if the input line does not indicate the start or end of a section.
 */
export const processLine = (str: string): SectionLineMetadata | null => {
  const regex =
    /(Running|Finished) command '([^']+)' in function '([^']+)' \(step ([^)]+)\)[^.]*\./;
  const match = trimSeverity(str).match(regex);
  if (match) {
    return {
      commandName: match[2],
      functionName: match[3],
      status: match[1] as SectionStatus,
      step: match[4],
    };
  }
  return null;
};

interface FunctionEntry {
  functionID: string;
  functionName: string;
  range: Range;
}

interface CommandEntry {
  commandID: string;
  commandName: string;
  functionID: string;
  range: Range;
  step: string;
}

interface SectionData {
  functions: FunctionEntry[];
  commands: CommandEntry[];
}

/**
 * `reduceFn` reduces the logs array to accumulate section data. Each entry in the returned array represents a section.
 * @param accum - The accumulated section data.
 * @param line - The current line being processed.
 * @param logIndex - The log index of the current line.
 * @returns The updated accumulated section data after processing the current line.
 */
const reduceFn = (
  accum: SectionData,
  line: string,
  logIndex: number,
): SectionData => {
  const currentLine = processLine(line);
  // Skip if the current line does not indicate a section
  if (!currentLine) {
    return accum;
  }
  const { commands, functions } = accum;
  if (currentLine.status === SectionStatus.Finished) {
    if (functions.length === 0 || commands.length === 0) {
      throw new Error(
        "Log file is showing a finished section without a running section before it.",
      );
    }
    // Update the end line number exclusive of the last section in the accumulator
    functions[functions.length - 1].range.end = logIndex + 1;
    commands[commands.length - 1].range.end = logIndex + 1;
    return { commands, functions };
  }

  /**
   * @description - ONGOING_ENTRY is used to indicate that the section or command is still running and has not finished yet in the log file.
   * The section parsing function will temporarily assign this value until the corresponding finished section or EOF is found.
   */
  const ONGOING_ENTRY = -1;
  if (currentLine.status === SectionStatus.Running) {
    const isNewSection =
      functions.length === 0 ||
      functions[functions.length - 1].functionName !== currentLine.functionName;
    if (isNewSection) {
      const isPreviousSectionRunning =
        functions.length &&
        functions[functions.length - 1].range.end === ONGOING_ENTRY;

      if (isPreviousSectionRunning) {
        throw new Error(
          "Log file is showing a new running section without finishing the previous section.",
        );
      }
      functions.push({
        functionID: `function-${logIndex}`,
        functionName: currentLine.functionName,
        range: { end: ONGOING_ENTRY, start: logIndex },
      });
    }
    const isPreviousCommandRunning =
      commands.length &&
      commands[commands.length - 1].range.end === ONGOING_ENTRY;
    if (isPreviousCommandRunning) {
      throw new Error(
        "Log file is showing a new running command without finishing the previous command.",
      );
    }
    commands.push({
      commandID: `command-${logIndex}`,
      commandName: currentLine.commandName,
      functionID: functions[functions.length - 1].functionID,
      range: { end: ONGOING_ENTRY, start: logIndex },
      step: currentLine.step,
    });
  }
  return { commands, functions };
};

/**
 * `parseSections` parses the raw logs array to extract section data.
 * @param logs - The array of log lines to be parsed.
 * @returns An array of section entries representing the parsed sections.
 */
const parseSections = (logs: string[]): SectionData => {
  const { commands, functions } = logs.reduce(reduceFn, {
    commands: [],
    functions: [],
  } as SectionData);
  const lastSectionIsRunning =
    functions.length && functions[functions.length - 1].range.end === -1;
  // Close the last section if it is still running
  if (lastSectionIsRunning) {
    functions[functions.length - 1].range.end = logs.length;
  }
  const lastCommandIsRunning =
    commands.length && commands[commands.length - 1].range.end === -1;
  if (lastCommandIsRunning) {
    commands[commands.length - 1].range.end = logs.length;
  }
  return { commands, functions };
};

/**
 * This function returns the next section state where all sections that contain the lineNumber values(s)
 * are open. If the next state is the same as the current state, the function will return the current state
 * @param props is an object with a lineNumber key(s), sectionData and sectionState.
 * @param props.sectionData is the parsed section data
 * @param props.sectionState is the current section state
 * @param props.lineNumber is a number or an array of numbers that represent raw log line numbers.
 * @returns SectionState | undefined
 */
const openSectionContainingLineNumberHelper = ({
  lineNumber,
  sectionData,
  sectionState,
}: {
  sectionData: SectionData;
  sectionState: SectionState;
  lineNumber: number | number[];
}) => {
  const lineNumberArray = Array.isArray(lineNumber) ? lineNumber : [lineNumber];
  const sectionContainingLine = lineNumberArray
    .map((n) =>
      sectionData?.commands.find((section) => includesLineNumber(section, n)),
    )
    .filter((v) => v) as CommandEntry[];
  const nextState = structuredClone(sectionState);
  let diff = false;
  if (sectionState) {
    sectionContainingLine.forEach(({ commandID, functionID }) => {
      if (
        sectionState[functionID].commands[commandID].isOpen !== true ||
        sectionState[functionID].isOpen !== true
      ) {
        diff = true;
      }
      nextState[functionID].commands[commandID].isOpen = true;
      nextState[functionID].isOpen = true;
    });
  }
  return diff ? nextState : sectionState;
};

/**
 * populateSectionState Populates the section state based on the section data.
 * All sections are set closed except those containing the given line number.
 * @param sectionData - The parsed section data
 * @param openSectionContainingLine - The line number to be used to determine which section to open
 * @returns A sectionState coresponding to sectionData with the specified section open
 */
const populateSectionState = (
  sectionData: SectionData,
  openSectionContainingLine: number | undefined,
): SectionState => {
  const { commands, functions } = sectionData;
  const sectionState: SectionState = {};
  functions.forEach(({ functionID }) => {
    sectionState[functionID] = { commands: {}, isOpen: false };
  });
  commands.forEach((sectionEntry) => {
    const { commandID, functionID } = sectionEntry;
    if (includesLineNumber(sectionEntry, openSectionContainingLine)) {
      sectionState[functionID].isOpen = true;
      sectionState[functionID].commands[commandID] = { isOpen: true };
    } else {
      sectionState[functionID].commands[commandID] = { isOpen: false };
    }
  });
  return sectionState;
};

export {
  parseSections,
  reduceFn,
  openSectionContainingLineNumberHelper,
  populateSectionState,
};
export type { FunctionEntry, SectionData, CommandEntry };
