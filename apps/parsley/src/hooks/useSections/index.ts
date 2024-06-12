import { useCallback, useEffect, useState } from "react";
import { useToastContext } from "context/toast";
import { reportError } from "utils/errorReporting";
import { SectionEntry, parseSections } from "./utils";

export type SectionState = { [functionName: string]: { isOpen: boolean } };
export type OpenSection = (functionName: string, isOpen: boolean) => void;
export type FocusSection = (functionName: string) => void;
export interface Result {
  sectionData: SectionEntry[] | undefined;
  openSection: OpenSection;
  sectionState: SectionState | undefined;
  focusSection: FocusSection;
}

interface Props {
  logs: string[];
  sectionsEnabled: boolean;
}
export const useSections = ({ logs, sectionsEnabled }: Props): Result => {
  const dispatchToast = useToastContext();
  const [sectionData, setSectionData] = useState<SectionEntry[] | undefined>();
  const [sectionState, setSectionState] = useState<SectionState>();
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

  useEffect(() => {
    if (sectionData && sectionState === undefined) {
      const defaultSectionState = sectionData.reduce(defaultStateReducer, {});
      setSectionState(defaultSectionState);
    }
  }, [sectionData, sectionState]);

  const openSection = useCallback(
    (functionName: string, isOpen: boolean) => {
      if (sectionState) {
        setSectionState({
          ...sectionState,
          [functionName]: { isOpen },
        });
      }
    },
    [sectionState],
  );
  const focusSection = useCallback(
    (functionName: string) => {
      if (sectionData && sectionState) {
        const nextState = sectionData.reduce(defaultStateReducer, {});
        nextState[functionName] = { isOpen: true };
        setSectionState(nextState);
      }
    },
    [sectionState],
  );
  return {
    focusSection,
    openSection,
    sectionData,
    sectionState,
  };
};

const defaultStateReducer = (
  accum: SectionState,
  { functionName }: SectionEntry,
) => ({ ...accum, ...{ [functionName]: { isOpen: false } } });
