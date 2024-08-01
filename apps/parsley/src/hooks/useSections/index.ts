import { useCallback, useEffect, useState } from "react";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useToastContext } from "context/toast";
import { useParsleySettings } from "hooks/useParsleySettings";
import { reportError } from "utils/errorReporting";
import { releaseSectioning } from "utils/featureFlag";
import {
  SectionData,
  getSectionStateWithOpenSectionBasedOnLineNumber,
  parseSections,
  populateSectionState,
} from "./utils";

export type SectionState = {
  [functionID: string]: {
    isOpen: boolean;
    commands: { [commandID: string]: { isOpen: boolean } };
  };
};

export type ToggleCommandSection = (props: {
  functionID: string;
  commandID: string;
  isOpen: boolean;
}) => void;

export type ToggleFunctionSection = (props: {
  functionID: string;
  isOpen: boolean;
}) => void;

export interface UseSectionsResult {
  sectionData: SectionData | undefined;
  toggleCommandSection: ToggleCommandSection;
  toggleFunctionSection: ToggleFunctionSection;
  sectionState: SectionState | undefined;
  sectioningEnabled: boolean;
  openSectionsContainingLineNumbers: (options: {
    lineNumbers: number[];
  }) => boolean;
}

interface Props {
  logs: string[];
  logType: string | undefined;
  renderingType: string | undefined;
  onInitOpenSectionContainingLine: number | undefined;
}
export const useSections = ({
  logType,
  logs,
  onInitOpenSectionContainingLine,
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
      setSectionState(
        populateSectionState(sectionData, onInitOpenSectionContainingLine),
      );
    }
  }, [sectionData, sectionState, onInitOpenSectionContainingLine]);

  const toggleFunctionSection: ToggleFunctionSection = useCallback(
    ({ functionID, isOpen }) => {
      setSectionState((currentState) => {
        if (currentState) {
          const nextState = { ...currentState };
          nextState[functionID].isOpen = isOpen;
          return nextState;
        }
        return currentState;
      });
    },
    [],
  );

  const toggleCommandSection: ToggleCommandSection = useCallback(
    ({ commandID, functionID, isOpen }) => {
      setSectionState((currentState) => {
        if (currentState) {
          const nextState = { ...currentState };
          nextState[functionID].commands[commandID].isOpen = isOpen;
          return nextState;
        }
        return currentState;
      });
    },
    [],
  );

  /**
   * openSectionsContainingLineNumbers Will update the current section state. If the next state is the
   * same as the current state the function will return true and false otherwise.
   * @param options is an object with a lineNumber key(s).
   * @param options.lineNumbers is a number or an array of numbers that represent raw log line numbers.
   * @returns true if the sectionState was updated and false otherwise
   */
  const openSectionsContainingLineNumbers = ({
    lineNumbers,
  }: {
    lineNumbers: number[];
  }): boolean => {
    if (!sectionData || !sectionState) {
      return false;
    }
    const [hasDiff, nextState] =
      getSectionStateWithOpenSectionBasedOnLineNumber({
        lineNumbers,
        sectionData,
        sectionState,
      });
    if (hasDiff) {
      setSectionState(nextState);
    }
    return hasDiff;
  };

  return {
    openSectionsContainingLineNumbers,
    sectionData,
    sectionState,
    sectioningEnabled,
    toggleCommandSection,
    toggleFunctionSection,
  };
};
