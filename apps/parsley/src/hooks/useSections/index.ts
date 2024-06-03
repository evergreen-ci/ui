import { useEffect, useState } from "react";
import { SectionEntry, parseSections } from "./utils";

export interface Result {
  sectionData: SectionEntry[] | undefined;
}
interface Props {
  logs: string[];
  sectionsEnabled?: boolean;
}
export const useSections = ({ logs, sectionsEnabled }: Props): Result => {
  const [sectionData, setSectionData] = useState<SectionEntry[] | undefined>();

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
