import { useState } from "react";
import {
  getLocalStorageBoolean,
  setLocalStorageBoolean,
} from "@evg-ui/lib/utils/localStorage";
import {
  JUMP_TO_FAILING_LINE_ENABLED,
  SECTIONS_ENABLED,
} from "constants/storageKeys";

export type ParsleySettings = {
  jumpToFailingLineEnabled: boolean;
  sectionsEnabled: boolean;
};

export type ParsleySettingsInput = Partial<ParsleySettings>;

type UseParsleySettingsReturnType = {
  settings: ParsleySettings;
  updateSettings: (settings: ParsleySettingsInput) => void;
};

/**
 * `useParsleySettings` reads and writes Parsley user preferences from localStorage.
 * @returns Parsley settings for the user, function for updating Parsley settings
 */
const useParsleySettings = (): UseParsleySettingsReturnType => {
  const [settings, setSettings] = useState<ParsleySettings>(() => ({
    jumpToFailingLineEnabled: getLocalStorageBoolean(
      JUMP_TO_FAILING_LINE_ENABLED,
      true,
    ),
    sectionsEnabled: getLocalStorageBoolean(SECTIONS_ENABLED, true),
  }));

  const updateSettings = (newSettings: ParsleySettingsInput) => {
    if (newSettings.jumpToFailingLineEnabled !== undefined) {
      setLocalStorageBoolean(
        JUMP_TO_FAILING_LINE_ENABLED,
        newSettings.jumpToFailingLineEnabled,
      );
    }
    if (newSettings.sectionsEnabled !== undefined) {
      setLocalStorageBoolean(SECTIONS_ENABLED, newSettings.sectionsEnabled);
    }
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
};

export { useParsleySettings };
