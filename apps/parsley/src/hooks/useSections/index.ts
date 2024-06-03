import { useEffect, useState } from "react";
import { Range } from "types/logs";

export interface SectionEntry {
  range: Range;
  functionName: string;
}
export type SectionData = SectionEntry[] | undefined;

export interface UseSectionsResult {
  sectionData: SectionData;
}
interface Props {
  logs: string[];
  sectionsEnabled?: boolean;
}
export const useSections = ({
  logs,
  sectionsEnabled,
}: Props): UseSectionsResult => {
  const [sectionData, setSectionData] = useState<SectionData>();

  console.log("useSections hook", sectionData);
  useEffect(() => {
    const shouldParse =
      logs.length && sectionsEnabled && sectionData === undefined;
    if (shouldParse) {
      const parseResult = parseSections(logs);
      setSectionData(parseResult);
    }
  }, [logs, sectionsEnabled]);

  return {
    sectionData,
  };
};

interface SectionLineMetadata {
  functionName: string;
  status: "Running" | "Finished";
}

/**
 * Parses a log line to extract metadata about a section entry.
 * @param str - The log line to be processed.
 * @returns The metadata about the section entry
 * or null if the input line does not indicate the start or end of a section.
 */
const processLine = (str: string): SectionLineMetadata | null => {
  if (str.startsWith("[P: ")) {
    // eslint-disable-next-line no-param-reassign
    str = str.substring(8);
  }

  const regex =
    /(Running|Finished) command '([^']+)'.*?in function '([^']+)'.*?\(step (\d+(\.\d+)?) of (\d+)\)/;
  const match = str.match(regex);

  if (match) {
    const status = match[1] as "Running" | "Finished";
    const functionName = match[3];

    return {
      functionName,
      status,
    };
  }
  return null;
};

/**
 * Reduces the logs array to accumulate section data. Each entry in the returned array represents a section.
 * @param accum - The accumulated section data.
 * @param line - The current line being processed.
 * @param i - The log index of the current line.
 * @returns The updated accumulated section data after processing the current line.
 */
const reduceFn = (
  accum: SectionEntry[],
  line: string,
  i: number,
): SectionEntry[] => {
  const currentLine = processLine(line);
  // Skip if the current line does not indicate a section
  if (!currentLine) {
    return accum;
  }
  const sections = [...accum];
  if (currentLine.status === "Finished") {
    if (sections.length === 0) {
      throw new Error(
        "Log file is showing a finished section without a running section before it. This should not happen.",
      );
    }
    // Update the end line number exclusive of the last section in the accumulator
    sections[sections.length - 1].range.end = i + 1;
    // If the current line indicates a running section and either no sections in the accumulator or the previous section is different from the current one, add a new section
  } else if (
    currentLine.status === "Running" &&
    (sections.length === 0 ||
      sections[sections.length - 1].functionName !== currentLine.functionName)
  ) {
    if (sections.length && sections[sections.length - 1].range.end === -1) {
      throw new Error(
        "Log file is showing a new running section without finishing the previous section.",
      );
    }
    // -1 represents an ongoing section in this function and will be overwritten in the final result
    sections.push({
      functionName: currentLine.functionName,
      range: { end: -1, start: i },
    });
  }
  return sections;
};

/**
 * Parses the raw logs array to extract section data.
 * @param logs - The array of log lines to be parsed.
 * @returns An array of section entries representing the parsed sections.
 */
const parseSections = (logs: string[]) => {
  const result = logs.reduce(reduceFn, [] as SectionEntry[]);
  const lastSectionIsRunning =
    result.length && result[result.length - 1].range.end === -1;
  // Close the last section if it is still running
  if (lastSectionIsRunning) {
    result[result.length - 1].range.end = logs.length;
  }
  return result;
};
