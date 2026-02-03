import { useCallback, useEffect, useState } from "react";
import { useToastContext } from "@evg-ui/lib/context";
import { reportError } from "@evg-ui/lib/utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useParsleySettings } from "hooks/useParsleySettings";
import {
  SectionData,
  getOpenSectionStateBasedOnLineNumbers,
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
  openSectionsContainingLineNumbers: (options: {
    lineNumbers: number[];
  }) => boolean;
}

interface Props {
  logs: string[];
  logType: string | undefined;
  renderingType: string | undefined;
  onInitOpenSectionsContainingLines: number[] | undefined;
}
export const useSections = ({
  logType,
  logs,
  onInitOpenSectionsContainingLines,
  renderingType,
}: Props): UseSectionsResult => {
  const dispatchToast = useToastContext();
  const [sectionData, setSectionData] = useState<SectionData | undefined>();
  const [sectionState, setSectionState] = useState<SectionState>();

  const { settings } = useParsleySettings();

  const sectioningEnabled =
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
          openSectionsContainingLines: onInitOpenSectionsContainingLines,
          sectionData,
        }),
      );
    }
  }, [sectionData, sectionState, onInitOpenSectionsContainingLines]);

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
    const [hasDiff, nextState] = getOpenSectionStateBasedOnLineNumbers({
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
    toggleAllCommandsInFunction,
    toggleAllSections,
    toggleCommandSection,
    toggleFunctionSection,
  };
};
