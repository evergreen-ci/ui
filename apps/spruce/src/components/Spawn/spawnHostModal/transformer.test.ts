import { SpawnHostInput } from "gql/generated/types";
import { formToGql } from "./transformer";
import { FormState } from "./types";

describe("spawn host modal", () => {
  it("correctly converts from a form to GQL", () => {
    data.forEach(({ formData, mutationInput }, i) => {
      expect(
        formToGql({
          formData,
          isVirtualWorkStation: i === 0,
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
          formData,
          isVirtualWorkStation: i === 0,
          migrateVolumeId,
          myPublicKeys,
          spawnTaskData: null,
        }),
      ).toStrictEqual({
        ...mutationInput,
        homeVolumeSize: null,
        volumeId: migrateVolumeId,
      });
    });
  });
});

const myPublicKeys = [{ key: "key value", name: "a_key" }];

const data: Array<{ formData: FormState; mutationInput: SpawnHostInput }> = [
  {
    formData: {
      debugSection: {
        isDebug: true,
      },
      expirationDetails: {
        expiration: "Thu Dec 08 2022 14:52:51 GMT-0500 (Eastern Standard Time)",
        noExpiration: false,
      },
      homeVolumeDetails: {
        selectExistingVolume: false,
        volumeSelect: "",
        volumeSize: 504,
      },
      publicKeySection: {
        newPublicKey: "blah blahsart",
        newPublicKeyName: "a name woo",
        publicKeyNameDropdown:
          "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
        savePublicKey: true,
        useExisting: false,
      },
      requiredSection: {
        distro: "ubuntu1804-workstation",
        region: "us-east-1",
      },
      setupScriptSection: {
        defineSetupScriptCheckbox: true,
        setupScript: "setup!!!",
      },
      userdataScriptSection: {
        runUserdataScript: true,
        userdataScript: "a user data script",
      },
    },
    mutationInput: {
      distroId: "ubuntu1804-workstation",
      expiration: new Date("2022-12-08T19:52:51.000Z"),
      homeVolumeSize: 504,
      isDebug: true,
      isVirtualWorkStation: true,
      noExpiration: false,
      publicKey: {
        key: "blah blahsart",
        name: "a name woo",
      },
      region: "us-east-1",
      savePublicKey: true,
      setUpScript: "setup!!!",
      sleepSchedule: null,
      spawnHostsStartedByTask: false,
      taskId: null,
      useProjectSetupScript: false,
      userDataScript: "a user data script",
      volumeId: null,
    },
  },
  {
    formData: {
      expirationDetails: {
        hostUptime: {
          details: { timeZone: "America/New_York" },
          sleepSchedule: {
            enabledWeekdays: [false, false, true, true, true, true],
            timeSelection: {
              runContinuously: false,
              startTime: "08:00",
              stopTime: "20:00",
            },
          },
          useDefaultUptimeSchedule: true,
        },
        noExpiration: true,
      },
      homeVolumeDetails: { selectExistingVolume: true, volumeSelect: "" },
      publicKeySection: {
        newPublicKey: "",
        publicKeyNameDropdown: "a_key",
        useExisting: true,
      },
      requiredSection: {
        distro: "rhel71-power8-large",
        region: "rofl-east",
      },
      setupScriptSection: { defineSetupScriptCheckbox: false },
      userdataScriptSection: { runUserdataScript: false },
    },
    mutationInput: {
      distroId: "rhel71-power8-large",
      expiration: null,
      homeVolumeSize: null,
      isVirtualWorkStation: false,
      noExpiration: true,
      publicKey: {
        key: "key value",
        name: "a_key",
      },
      region: "rofl-east",
      savePublicKey: false,
      setUpScript: null,
      sleepSchedule: {
        dailyStartTime: "08:00",
        dailyStopTime: "20:00",
        permanentlyExempt: false,
        shouldKeepOff: false,
        timeZone: "America/New_York",
        wholeWeekdaysOff: [0, 6],
      },
      spawnHostsStartedByTask: false,
      taskId: null,
      useProjectSetupScript: false,
      userDataScript: null,
      volumeId: null,
    },
  },
];
