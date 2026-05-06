import { gql } from "@apollo/client";
import { BASE_SPAWN_HOST } from "../fragments/baseSpawnHost";

export const EDIT_SPAWN_HOST = gql`
  mutation EditSpawnHost(
    $hostId: String!
    $displayName: String
    $addedInstanceTags: [InstanceTagInput!]
    $deletedInstanceTags: [InstanceTagInput!]
    $volumeId: String
    $instanceType: String
    $expiration: Time
    $noExpiration: Boolean
    $servicePassword: String
    $publicKey: PublicKeyInput
    $savePublicKey: Boolean
    $sleepSchedule: SleepScheduleInput
  ) {
    editSpawnHost(
      spawnHost: {
        hostId: $hostId
        displayName: $displayName
        addedInstanceTags: $addedInstanceTags
        deletedInstanceTags: $deletedInstanceTags
        volume: $volumeId
        instanceType: $instanceType
        expiration: $expiration
        noExpiration: $noExpiration
        servicePassword: $servicePassword
        publicKey: $publicKey
        savePublicKey: $savePublicKey
        sleepSchedule: $sleepSchedule
      }
    ) {
      ...BaseSpawnHost
    }
  }
  ${BASE_SPAWN_HOST}
`;
