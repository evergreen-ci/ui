import { useCallback, useEffect, useState } from "react";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useToastContext } from "context/toast";
import { useParsleySettings } from "hooks/useParsleySettings";
import { reportError } from "utils/errorReporting";
import { releaseSectioning } from "utils/featureFlag";
import {
  SectionData,
  openSectionContainingLineNumberHelper,
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
  toggleAllCommandsInFunction: (functionID: string, isOpen: boolean) => void;
  toggleCommandSection: ToggleCommandSection;
  toggleFunctionSection: ToggleFunctionSection;
  toggleAllSections: (isOpen: boolean) => void;
  sectionState: SectionState | undefined;
  sectioningEnabled: boolean;
  openSectionContainingLineNumber: (p: {
    lineNumber: number | number[];
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
        populateSectionState({
          openSectionContainingLine: onInitOpenSectionContainingLine,
          sectionData,
        }),
      );
    }
  }, [sectionData, sectionState, onInitOpenSectionContainingLine]);

  const toggleFunctionSection: ToggleFunctionSection = useCallback(
    ({ functionID, isOpen }) => {
      setSectionState((currentState) => {
        if (currentState) {
          const nextState = { ...currentState };
          nextState[functionID].isOpen = isOpen;
          const commands = Object.keys(nextState[functionID].commands);
          // If the function is being opened and contains 1 command, open the command as well
          if (commands.length === 1 && isOpen) {
            nextState[functionID].commands[commands[0]].isOpen = isOpen;
          }
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
   * toggleAllCommandsInFunction will toggle all commands in a function section.
   * @param functionID is the id of the function section.
   * @param isOpen If true, all command sections in the function will be opened including the function.
   * If false, all command sections will be closed without affecting the function open/close state.
   */
  const toggleAllCommandsInFunction = useCallback(
    (functionID: string, isOpen: boolean) => {
      setSectionState((currentState) => {
        if (currentState) {
          const nextState = structuredClone(currentState);
          if (isOpen) {
            nextState[functionID].isOpen = isOpen;
          }
          const commands = Object.keys(nextState[functionID].commands);
          commands.forEach((commandID) => {
            nextState[functionID].commands[commandID].isOpen = isOpen;
          });
          return nextState;
        }
        return currentState;
      });
    },
    [],
  );

  const toggleAllSections = useCallback(
    (isOpen: boolean) => {
      if (sectionData) {
        setSectionState(() => populateSectionState({ isOpen, sectionData }));
      }
    },
    [sectionData],
  );

  /**
   * This function will update the current section state. If the next state is the
   * same as the current state the function will return true and false otherwise.
   * @param param0 is an object with a lineNumber key(s).
   * @param param0.lineNumber is a number or an array of numbers that represent raw log line numbers.
   * @returns true if the sectionState was updated and false otherwise
   */
  const openSectionContainingLineNumber = ({
    lineNumber,
  }: {
    lineNumber: number | number[];
  }): boolean => {
    if (!sectionData || !sectionState) {
      return false;
    }
    const nextState = openSectionContainingLineNumberHelper({
      lineNumber,
      sectionData,
      sectionState,
    });
    setSectionState(nextState);
    return nextState !== sectionState;
  };

  return {
    openSectionContainingLineNumber,
    sectionData,
    sectionState,
    sectioningEnabled,
    toggleAllCommandsInFunction,
    toggleAllSections,
    toggleCommandSection,
    toggleFunctionSection,
  };
};
