import { SpawnVolumeMutationVariables } from "gql/generated/types";
import { FormState } from "./types";

interface Props {
  formData: FormState;
}
export const formToGql = ({
  formData,
}: Props): SpawnVolumeMutationVariables["spawnVolumeInput"] => {
  const { optionalVolumeInformation, requiredVolumeInformation } =
    formData || {};

  const { availabilityZone, size, type } = requiredVolumeInformation || {};

  const { expirationDetails, mountToHost } = optionalVolumeInformation || {};
  const { expiration, noExpiration } = expirationDetails || {};

  return {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    availabilityZone,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    size,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    type,
    noExpiration,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    expiration: noExpiration ? null : new Date(expiration),
    host: mountToHost || null,
  };
};
