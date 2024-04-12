import { useEffect } from "react";
import { usePrevious } from "hooks";
import { getDefaultExpiration } from "../utils";
import { FormState } from "./types";

interface Props {
  disableExpirationCheckbox: boolean;
  formState: FormState;
  isVirtualWorkstation: boolean;
  setFormState: (formState: FormState) => void;
}
export const useVirtualWorkstationDefaultExpiration = ({
  disableExpirationCheckbox,
  formState,
  isVirtualWorkstation,
  setFormState,
}: Props) => {
  // Default virtual workstations to unexpirable upon selection if possible
  const prevIsVirtualWorkStation = usePrevious(isVirtualWorkstation);
  useEffect(() => {
    if (isVirtualWorkstation && !prevIsVirtualWorkStation) {
      setFormState({
        ...formState,
        expirationDetails: {
          noExpiration: isVirtualWorkstation && !disableExpirationCheckbox,
          expiration: getDefaultExpiration(),
        },
      });
    }
  }, [
    disableExpirationCheckbox,
    formState,
    isVirtualWorkstation,
    prevIsVirtualWorkStation,
    setFormState,
  ]);
};
