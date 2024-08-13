import { formToGql } from "./transformer";

describe("edit spawn host modal", () => {
  it("correctly converts from a form to GQL", () => {
    expect(
      formToGql({
        formData: formState,
        hostId: "host_id",
        myPublicKeys,
        oldUserTags,
      }),
    ).toStrictEqual({
      hostId: "host_id",
      displayName: "new-name",
      volumeId: "my-volume-id",
      instanceType: "m4.xlarge",
      addedInstanceTags: [
        { key: "c", value: "e" },
        { key: "newKey", value: "newValue" },
      ],
      deletedInstanceTags: [
        { key: "c", value: "d" },
        { key: "oldKey", value: "oldValue" },
      ],
      expiration: null,
      noExpiration: true,
      servicePassword: "password-123",
      sleepSchedule: {
        dailyStartTime: "09:00",
        dailyStopTime: "17:00",
        isBetaTester: false,
        permanentlyExempt: false,
        shouldKeepOff: false,
        timeZone: "America/New_York",
        wholeWeekdaysOff: [0, 5, 6],
      },
      publicKey: {
        name: "a_key",
        key: "key value",
      },
      savePublicKey: false,
    });
  });
});

const myPublicKeys = [{ name: "a_key", key: "key value" }];
const oldUserTags = [
  { key: "a", value: "b" },
  { key: "c", value: "d" },
  { key: "oldKey", value: "oldValue" },
];

const formState = {
  hostName: "new-name",
  expirationDetails: {
    noExpiration: true,
    expiration: "Wed Oct 19 2022 08:56:42 GMT-0400 (Eastern Daylight Time)",
    hostUptime: {
      useDefaultUptimeSchedule: false,
      isBetaTester: false,
      sleepSchedule: {
        enabledWeekdays: [false, true, true, true, true, false, false],
        timeSelection: {
          startTime: "Fri May 03 2024 09:00:00",
          stopTime: "Fri May 03 2024 17:00:00",
          runContinuously: false,
        },
      },
      details: {
        timeZone: "America/New_York",
      },
    },
  },
  instanceType: "m4.xlarge",
  volume: "my-volume-id",
  rdpPassword: "password-123",
  userTags: [
    { key: "a", value: "b" },
    { key: "c", value: "e" },
    { key: "newKey", value: "newValue" },
  ],
  publicKeySection: {
    useExisting: true,
    publicKeyNameDropdown: "a_key",
    newPublicKey: "",
  },
};
