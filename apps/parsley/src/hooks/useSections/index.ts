import { useEffect, useState } from "react";
import { useToastContext } from "context/toast";
import { reportError } from "utils/errorReporting";
import { SectionEntry, parseSections } from "./utils";

export interface Result {
  sectionData: SectionEntry[] | undefined;
}
interface Props {
  logs: string[];
  sectionsEnabled: boolean;
}
export const useSections = ({ logs, sectionsEnabled }: Props): Result => {
  const dispatchToast = useToastContext();
  const [sectionData, setSectionData] = useState<SectionEntry[] | undefined>();

  const shouldParse =
    logs.length && sectionsEnabled && sectionData === undefined;
  useEffect(() => {
    if (shouldParse) {
      let parseResult;
      try {
        parseResult = parseSections(logs);
      } catch (e) {
        dispatchToast.error("An error occurred while parsing log sections.");
        reportError(e as Error).severe();
      }
      setSectionData(parseResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldParse]);

  return {
    sectionData,
  };
};
