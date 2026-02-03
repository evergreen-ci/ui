import { trimSeverity } from "@evg-ui/lib/utils";
import { Range } from "types/logs";
import { includesLineNumber } from "utils/logRow";
import { SectionState } from ".";

enum SectionStatus {
  Running = "Running",
  Finished = "Finished",
}

interface SectionLineMetadata {
  commandName: string;
  commandDescription: string | undefined;
  functionName: string | undefined;
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
    /(Running|Finished) command '([^']+)'(?: \('([^']+)'\))?(?: \('[^']*'\))?(?: in function '([^']+)')? \(step ([^ ]+ of [^)]+)\)[^.]*\./;
  const match = trimSeverity(str).match(regex);
  if (match) {
    return {
      commandDescription: match[3],
      commandName: match[2],
      functionName: match[4],
      status: match[1] as SectionStatus,
      step: match[5],
    };
  }
  return null;
};

interface FunctionEntry {
  functionID: string;
  functionName: string | undefined;
  range: Range;
  containsTopLevelCommand: boolean;
}

interface CommandEntry {
  commandDescription: string | undefined;
  commandID: string;
  commandName: string;
  functionID: string;
  range: Range;
  step: string;
  isTopLevelCommand: boolean;
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
    const containsTopLevelCommand = currentLine.functionName === undefined;
    const isNewSection =
      functions.length === 0 ||
      functions[functions.length - 1].functionName !==
        currentLine.functionName ||
      containsTopLevelCommand;
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
        containsTopLevelCommand,
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
      commandDescription: currentLine.commandDescription,
      commandID: `command-${logIndex}`,
      commandName: currentLine.commandName,
      functionID: functions[functions.length - 1].functionID,
      isTopLevelCommand: containsTopLevelCommand,
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
 * getOpenSectionStateBasedOnLineNumbers Gets the next section state where all sections that contain the lineNumber values(s)
 * are open. The return value returns a boolean representing if the next state is different from current state
 * as well as the next section state.
 * @param props is an object with a lineNumber key(s), sectionData and sectionState.
 * @param props.sectionData is the parsed section data
 * @param props.sectionState is the current section state
 * @param props.lineNumbers is an array of numbers that represent raw log line numbers.
 * @returns [boolean, SectionState]
 */
const getOpenSectionStateBasedOnLineNumbers = ({
  lineNumbers,
  sectionData,
  sectionState,
}: {
  sectionData: SectionData;
  sectionState: SectionState;
  lineNumbers: number[];
}): [boolean, SectionState] => {
  const sectionContainingLine = sectionData.commands.filter((section) =>
    lineNumbers.some((n) => includesLineNumber(section, n)),
  );
  const nextState = structuredClone(sectionState);
  let hasDiff = false;
  sectionContainingLine.forEach(({ commandID, functionID }) => {
    if (
      sectionState[functionID].commands[commandID].isOpen !== true ||
      sectionState[functionID].isOpen !== true
    ) {
      hasDiff = true;
    }
    nextState[functionID].commands[commandID].isOpen = true;
    nextState[functionID].isOpen = true;
  });
  return [hasDiff, nextState];
};

interface PopulateSectionStateParams {
  sectionData: SectionData;
  openSectionsContainingLines?: number[];
  isOpen?: boolean;
}
/**
 * populateSectionState Populates the section state based on the section data.
 * All sections are set closed except those containing the given line number.
 * @param params - The parameters for the function
 * @param params.sectionData - The parsed section data
 * @param params.openSectionsContainingLines - Line numbers used to determine which sections to open
 * @param params.isOpen - The default open state for the sections
 * @returns A sectionState coresponding to sectionData with the specified section open
 */

const populateSectionState = ({
  isOpen = false,
  openSectionsContainingLines,
  sectionData,
}: PopulateSectionStateParams): SectionState => {
  const { commands, functions } = sectionData;
  const sectionState: SectionState = {};
  functions.forEach(({ functionID }) => {
    sectionState[functionID] = { commands: {}, isOpen };
  });
  commands.forEach((sectionEntry) => {
    const { commandID, functionID } = sectionEntry;
    if (
      openSectionsContainingLines?.some((lineNumber) =>
        includesLineNumber(sectionEntry, lineNumber),
      )
    ) {
      sectionState[functionID].isOpen = true;
      sectionState[functionID].commands[commandID] = { isOpen: true };
    } else {
      sectionState[functionID].commands[commandID] = { isOpen };
    }
  });
  return sectionState;
};

export {
  parseSections,
  reduceFn,
  getOpenSectionStateBasedOnLineNumbers,
  populateSectionState,
};
export type { FunctionEntry, SectionData, CommandEntry };
