import { diff } from "deep-object-diff";
import { FormState } from "./types";

export const formToGql = (
  initialState: FormState,
  formData: FormState,
  volumeId: string,
) => {
  const updatedFields: Partial<FormState> = diff(initialState, formData);
  const {
    expirationDetails = {} as FormState["expirationDetails"],
    name = "",
    size,
  } = updatedFields;

  const { expiration = formData.expirationDetails?.expiration, noExpiration } =
    expirationDetails ?? {};

  return {
    ...(noExpiration && { noExpiration }),
    ...(expiration && !noExpiration && { expiration: new Date(expiration) }),
    ...(name && { name }),
    ...(size && { size }),
    volumeId,
  };
};
