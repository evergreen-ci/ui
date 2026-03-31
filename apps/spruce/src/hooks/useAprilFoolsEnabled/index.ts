import { useState, useEffect } from "react";
import {
  getLocalStorageBoolean,
  setLocalStorageBoolean,
} from "@evg-ui/lib/utils/localStorage";
import { APRIL_FOOLS } from "constants/cookies";

export const useAprilFoolsEnabled = () => {
  const [enabled, setEnabled] = useState<boolean>(() =>
    getLocalStorageBoolean(APRIL_FOOLS, false),
  );

  useEffect(() => {
    setLocalStorageBoolean(APRIL_FOOLS, enabled);
  }, [enabled]);

  return { enabled, setEnabled };
};
