import { useEffect, useState } from "react";

export interface SectionEntry {
  lineStart: number;
  lineEnd?: number;
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
export const useSections = ({logs, sectionsEnabled}: Props): UseSectionsResult => {
  const [sectionData, setSectionData] =
    useState<SectionData>();
  useEffect(() => {
    if (logs.length && sectionsEnabled && sectionData === undefined) {
      const data = logs.reduce(reduceFn, [] as SectionEntry[]);
      setSectionData(data);
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
 * @param {string} str - The log line to be processed.
 * @returns {SectionLineMetadata | null} The metadata about the section entry
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
* @param {SectionEntry[]} accum - The accumulated section data.
* @param {string} line - The current line being processed.
* @param {number} i - The log index of the current line.
* @returns {SectionEntry[]} The updated accumulated section data after processing the current line.
*/
const reduceFn = (accum: SectionEntry[], line: string, i: number) => {
 const currentLine = processLine(line);
 // Skip if the current line does not indicate a section
 if (!currentLine) {
   return accum;
 }

 if (currentLine.status === "Finished") {
   if (accum.length === 0) {
     throw new Error("Log file is showing a finished section without a running section before it. This should not happen.");
   }
   // Update the end line number of the last section in the accumulator
   accum[accum.length - 1].lineEnd = i;
   // If the current line indicates a running section and either no sections in the accumulator or the previous section is different from the current one, add a new section
 } else if (currentLine.status === "Running" && (accum.length === 0 || accum[accum.length - 1].functionName !== currentLine.functionName)) {
   accum.push({ lineStart: i, functionName: currentLine.functionName });
 }

 return accum;
};