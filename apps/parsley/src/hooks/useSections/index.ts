import { useCallback, useEffect, useState } from "react";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useToastContext } from "context/toast";
import { useParsleySettings } from "hooks/useParsleySettings";
import { reportError } from "utils/errorReporting";
import { releaseSectioning } from "utils/featureFlag";
import { SectionEntry, parseSections } from "./utils";

export type SectionState = { [functionName: string]: { isOpen: boolean } };
export type OpenSection = (functionName: string, isOpen: boolean) => void;

export interface UseSectionsResult {
  sectionData: SectionEntry[] | undefined;
  openSection: OpenSection;
  sectionState: SectionState | undefined;
  sectioningEnabled: boolean;
}

interface Props {
  logs: string[];
  logType: string | undefined;
  renderingType: string | undefined;
}
export const useSections = ({
  logType,
  logs,
  renderingType,
}: Props): UseSectionsResult => {
  const dispatchToast = useToastContext();
  const [sectionData, setSectionData] = useState<SectionEntry[] | undefined>();
  const [sectionState, setSectionState] = useState<SectionState>();

  const { settings } = useParsleySettings();

  const sectioningEnabled =
    releaseSectioning &&
    !!settings?.sectionsEnabled &&
    logType === LogTypes.EVERGREEN_TASK_LOGS &&
    renderingType === LogRenderingTypes.Default;

  const shouldParse =
    logs.length && sectioningEnabled && sectionData === undefined;
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
      setSectionState(sectionData.reduce(closeAllSectionsReducer, {}));
    }
  }, [sectionData, sectionState]);

  const openSection = useCallback(
    (functionName: string, isOpen: boolean) => {
      if (sectionState) {
        setSectionState((currentState) => ({
          ...currentState,
          [functionName]: { isOpen },
        }));
      }
    },
    [sectionState],
  );
  return {
    openSection,
    sectionData,
    sectionState,
    sectioningEnabled,
  };
};

const closeAllSectionsReducer = (
  accum: SectionState,
  { functionName }: SectionEntry,
) => ({ ...accum, ...{ [functionName]: { isOpen: false } } });
