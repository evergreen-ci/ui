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
  } = updatedFields;
  // @ts-ignore: FIXME. This comment was added by an automated script.
  const { expiration, noExpiration } = expirationDetails;

  return {
    ...(noExpiration && { noExpiration }),
    ...(expiration && !noExpiration && { expiration: new Date(expiration) }),
    ...(name && { name }),
    volumeId,
  };
};
