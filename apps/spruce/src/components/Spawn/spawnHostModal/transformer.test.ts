import { SpawnHostInput } from "gql/generated/types";
import { formToGql } from "./transformer";
import { FormState } from "./types";

describe("spawn host modal", () => {
  it("correctly converts from a form to GQL", () => {
    data.forEach(({ formData, mutationInput }, i) => {
      expect(
        formToGql({
          isVirtualWorkStation: i === 0,
          formData,
          myPublicKeys,
          spawnTaskData: null,
        }),
      ).toStrictEqual(mutationInput);
    });
  });
  it("migrate volume id should be reflected in the gql output when supplied", () => {
    const migrateVolumeId = "some_volume";
    data.forEach(({ formData, mutationInput }, i) => {
      expect(
        formToGql({
          isVirtualWorkStation: i === 0,
          formData,
          myPublicKeys,
          spawnTaskData: null,
          migrateVolumeId,
        }),
      ).toStrictEqual({
        ...mutationInput,
        volumeId: migrateVolumeId,
        homeVolumeSize: null,
      });
    });
  });
});

const myPublicKeys = [{ name: "a_key", key: "key value" }];

const data: Array<{ formData: FormState; mutationInput: SpawnHostInput }> = [
  {
    formData: {
      isDebug: true,
      requiredSection: {
        distro: "ubuntu1804-workstation",
        region: "us-east-1",
      },
      publicKeySection: {
        useExisting: false,
        newPublicKey: "blah blahsart",
        publicKeyNameDropdown:
          "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
        savePublicKey: true,
        newPublicKeyName: "a name woo",
      },
      userdataScriptSection: {
        runUserdataScript: true,
        userdataScript: "a user data script",
      },
      setupScriptSection: {
        defineSetupScriptCheckbox: true,
        setupScript: "setup!!!",
      },
      expirationDetails: {
        noExpiration: false,
        expiration: "Thu Dec 08 2022 14:52:51 GMT-0500 (Eastern Standard Time)",
      },
      homeVolumeDetails: {
        selectExistingVolume: false,
        volumeSize: 504,
        volumeSelect: "",
      },
    },
    mutationInput: {
      isDebug: true,
      isVirtualWorkStation: true,
      userDataScript: "a user data script",
      expiration: new Date("2022-12-08T19:52:51.000Z"),
      noExpiration: false,
      volumeId: null,
      homeVolumeSize: 504,
      publicKey: {
        name: "a name woo",
        key: "blah blahsart",
      },
      savePublicKey: true,
      distroId: "ubuntu1804-workstation",
      region: "us-east-1",
      taskId: null,
      useProjectSetupScript: false,
      useOAuth: false,
      setUpScript: "setup!!!",
      spawnHostsStartedByTask: false,
      sleepSchedule: null,
    },
  },
  {
    formData: {
      requiredSection: {
        distro: "rhel71-power8-large",
        region: "rofl-east",
      },
      publicKeySection: {
        useExisting: true,
        publicKeyNameDropdown: "a_key",
        newPublicKey: "",
      },
      userdataScriptSection: { runUserdataScript: false },
      setupScriptSection: { defineSetupScriptCheckbox: false },
      expirationDetails: {
        noExpiration: true,
        hostUptime: {
          useDefaultUptimeSchedule: true,
          sleepSchedule: {
            enabledWeekdays: [false, false, true, true, true, true],
            timeSelection: {
              startTime: "08:00",
              stopTime: "20:00",
              runContinuously: false,
            },
          },
          details: { timeZone: "America/New_York" },
        },
      },
      homeVolumeDetails: { selectExistingVolume: true, volumeSelect: "" },
    },
    mutationInput: {
      isVirtualWorkStation: false,
      userDataScript: null,
      expiration: null,
      noExpiration: true,
      volumeId: null,
      homeVolumeSize: null,
      publicKey: {
        key: "key value",
        name: "a_key",
      },
      savePublicKey: false,
      distroId: "rhel71-power8-large",
      region: "rofl-east",
      taskId: null,
      useProjectSetupScript: false,
      useOAuth: false,
      setUpScript: null,
      spawnHostsStartedByTask: false,
      sleepSchedule: {
        dailyStartTime: "08:00",
        dailyStopTime: "20:00",
        permanentlyExempt: false,
        timeZone: "America/New_York",
        shouldKeepOff: false,
        wholeWeekdaysOff: [0, 6],
      },
    },
  },
];
