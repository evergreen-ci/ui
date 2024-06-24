import { useCallback, useEffect, useState } from "react";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useToastContext } from "context/toast";
import { useParsleySettings } from "hooks/useParsleySettings";
import { reportError } from "utils/errorReporting";
import { releaseSectioning } from "utils/featureFlag";
import { SectionData, parseSections } from "./utils";

export type SectionState = {
  [functionID: string]: {
    isOpen: boolean;
    commands: { [commandID: string]: { isOpen: boolean } };
  };
};
export type OpenSection = (props: {
  functionID: string;
  commandID?: string;
  isOpen: boolean;
}) => void;

export interface UseSectionsResult {
  sectionData: SectionData | undefined;
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
  const [sectionData, setSectionData] = useState<SectionData | undefined>();
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
      setSectionState(populateSectionState(sectionData));
    }
  }, [sectionData, sectionState]);

  const openSection: OpenSection = useCallback(
    ({ commandID, functionID, isOpen }) => {
      setSectionState((currentState) => {
        if (currentState) {
          const nextState = { ...currentState };
          if (commandID) {
            nextState[functionID].commands[commandID].isOpen = isOpen;
          } else {
            nextState[functionID].isOpen = isOpen;
          }
          return nextState;
        }
        return currentState;
      });
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

const populateSectionState = (sectionData: SectionData): SectionState => {
  const { commands, functions } = sectionData;
  const sectionState: SectionState = {};
  functions.forEach(({ functionID }) => {
    sectionState[functionID] = { commands: {}, isOpen: false };
  });
  commands.forEach(({ commandID, functionID }) => {
    sectionState[functionID].commands[commandID] = { isOpen: false };
  });
  return sectionState;
};
