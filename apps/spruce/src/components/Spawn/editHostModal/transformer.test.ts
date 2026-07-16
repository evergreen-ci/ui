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
      addedInstanceTags: [
        { key: "c", value: "e" },
        { key: "newKey", value: "newValue" },
      ],
      deletedInstanceTags: [
        { key: "c", value: "d" },
        { key: "oldKey", value: "oldValue" },
      ],
      displayName: "new-name",
      expiration: null,
      hostId: "host_id",
      instanceType: "m4.xlarge",
      noExpiration: true,
      publicKey: {
        key: "key value",
        name: "a_key",
      },
      savePublicKey: false,
      servicePassword: "password-123",
      sleepSchedule: {
        dailyStartTime: "09:00",
        dailyStopTime: "17:00",
        permanentlyExempt: false,
        shouldKeepOff: false,
        timeZone: "America/New_York",
        wholeWeekdaysOff: [0, 5, 6],
      },
      volumeId: "my-volume-id",
    });
  });
});

const myPublicKeys = [{ key: "key value", name: "a_key" }];
const oldUserTags = [
  { key: "a", value: "b" },
  { key: "c", value: "d" },
  { key: "oldKey", value: "oldValue" },
];

const formState = {
  expirationDetails: {
    expiration: "Wed Oct 19 2022 08:56:42 GMT-0400 (Eastern Daylight Time)",
    hostUptime: {
      details: {
        timeZone: "America/New_York",
      },
      sleepSchedule: {
        enabledWeekdays: [false, true, true, true, true, false, false],
        timeSelection: {
          runContinuously: false,
          startTime: "Fri May 03 2024 09:00:00",
          stopTime: "Fri May 03 2024 17:00:00",
        },
      },
      useDefaultUptimeSchedule: false,
    },
    noExpiration: true,
  },
  hostName: "new-name",
  instanceType: "m4.xlarge",
  publicKeySection: {
    newPublicKey: "",
    publicKeyNameDropdown: "a_key",
    useExisting: true,
  },
  rdpPassword: "password-123",
  userTags: [
    { key: "a", value: "b" },
    { key: "c", value: "e" },
    { key: "newKey", value: "newValue" },
  ],
  volume: "my-volume-id",
};
