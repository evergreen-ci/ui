import {
  MyPublicKeysQuery,
  EditSpawnHostMutationVariables,
} from "gql/generated/types";
import { string } from "utils";
import { getSleepSchedule } from "../utils";
import { FormState } from "./types";

const { stripNewLines } = string;

interface Props {
  hostId: string;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  formData: FormState;
  oldUserTags: { key: string; value: string }[];
  timeZone: string;
}
export const formToGql = ({
  formData,
  hostId,
  myPublicKeys,
  oldUserTags,
  timeZone,
}: Props): EditSpawnHostMutationVariables => {
  const {
    expirationDetails,
    hostName,
    instanceType,
    publicKeySection,
    rdpPassword,
    userTags: newUserTags,
    volume,
  } = formData || {};

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { expiration, hostUptime, noExpiration } = expirationDetails;
  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    newPublicKey = "",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    newPublicKeyName = "",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    publicKeyNameDropdown = "",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    savePublicKey = false,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    useExisting,
  } = publicKeySection;

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const addedTags = newUserTags.filter((n) =>
    oldUserTags.every((o) => n.key !== o.key || n.value !== o.value),
  );
  const deletedTags = oldUserTags.filter((o) =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    newUserTags.every((n) => n.key !== o.key || n.value !== o.value),
  );

  return {
    hostId,
    displayName: hostName,
    volumeId: volume,
    instanceType,
    addedInstanceTags: addedTags,
    deletedInstanceTags: deletedTags,
    expiration: noExpiration ? null : new Date(expiration),
    noExpiration,
    servicePassword: rdpPassword,
    publicKey: {
      name: useExisting ? publicKeyNameDropdown : newPublicKeyName,
      key: useExisting
        ? (
            myPublicKeys.find(({ name }) => name === publicKeyNameDropdown) ?? {
              key: "",
            }
          ).key
        : stripNewLines(newPublicKey),
    },
    savePublicKey: !useExisting && savePublicKey,
    sleepSchedule:
      noExpiration && hostUptime
        ? getSleepSchedule(hostUptime, timeZone)
        : null,
  };
};
