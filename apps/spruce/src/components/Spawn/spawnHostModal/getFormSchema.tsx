import { css } from "@emotion/react";
import { InlineCode } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm/types";
import widgets from "components/SpruceForm/Widgets";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import {
  MyPublicKeysQuery,
  SpawnTaskQuery,
  MyVolumesQuery,
} from "gql/generated/types";
import { shortenGithash } from "utils/string";
import {
  getExpirationDetailsSchema,
  getPublicKeySchema,
} from "../getFormSchema";
import { DEFAULT_VOLUME_SIZE } from "./constants";
import { validateTask } from "./utils";
import { DistroDropdown } from "./Widgets/DistroDropdown";

interface Props {
  awsRegions: string[];
  disableExpirationCheckbox: boolean;
  distroIdQueryParam?: string;
  distros: {
    adminOnly: boolean;
    isVirtualWorkStation: boolean;
    name?: string;
  }[];
  hostUptimeWarnings?: {
    enabledHoursCount: number;
    warnings: string[];
  };
  isMigration: boolean;
  isVirtualWorkstation: boolean;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  noExpirationCheckboxTooltip: string;
  permanentlyExempt: boolean;
  spawnTaskData?: SpawnTaskQuery["task"];
  timeZone: string;
  useSetupScript?: boolean;
  useProjectSetupScript?: boolean;
  userAwsRegion?: string;
  volumes: MyVolumesQuery["myVolumes"];
}

export const getFormSchema = ({
  awsRegions,
  disableExpirationCheckbox,
  distroIdQueryParam,
  distros,
  hostUptimeWarnings,
  isMigration,
  isVirtualWorkstation,
  myPublicKeys,
  noExpirationCheckboxTooltip,
  permanentlyExempt,
  spawnTaskData,
  timeZone,
  useProjectSetupScript = false,
  useSetupScript = false,
  userAwsRegion,
  volumes,
}: Props): ReturnType<GetFormSchema> => {
  const {
    buildVariant,
    displayName: taskDisplayName,
    project,
    revision,
  } = spawnTaskData || {};
  const hasValidTask = validateTask(spawnTaskData);
  const shouldRenderVolumeSelection = !isMigration && isVirtualWorkstation;
  const availableVolumes = volumes
    ? volumes.filter((v) => v.homeVolume && !v.hostID)
    : [];

  const expirationDetails = getExpirationDetailsSchema({
    disableExpirationCheckbox,
    hostUptimeWarnings,
    isEditModal: false,
    noExpirationCheckboxTooltip,
    permanentlyExempt,
    timeZone,
  });
  const publicKeys = getPublicKeySchema({ myPublicKeys });

  return {
    fields: {},
    schema: {
      type: "object" as "object",
      properties: {
        requiredSection: {
          type: "object" as "object",
          title: "",
          properties: {
            distro: {
              type: "string" as "string",
              title: "Distro",
              default: distroIdQueryParam,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              enum: distros?.map(({ name }) => name),
              minLength: 1,
            },
            region: {
              type: "string" as "string",
              title: "Region",
              default: userAwsRegion || (awsRegions?.length && awsRegions[0]),
              oneOf: [
                ...(awsRegions?.map((r) => ({
                  type: "string" as "string",
                  title: r,
                  enum: [r],
                })) || []),
              ],
              minLength: 1,
            },
          },
        },
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        publicKeySection: publicKeys.schema,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        expirationDetails: expirationDetails.schema,
        optionalInformationTitle: {
          title: "Optional Host Details",
          type: "null",
        },
        userdataScriptSection: {
          type: "object" as "object",
          title: "",
          properties: {
            runUserdataScript: {
              title: "Run Userdata script on start",
              type: "boolean",
            },
          },
          dependencies: {
            runUserdataScript: {
              oneOf: [
                {
                  properties: {
                    runUserdataScript: {
                      enum: [true],
                    },
                    userdataScript: {
                      title: "Userdata Script",
                      type: "string" as "string",
                      default: "",
                      minLength: 1,
                    },
                  },
                },
                {
                  properties: {
                    runUserdataScript: {
                      enum: [false],
                    },
                  },
                },
              ],
            },
          },
        },
        setupScriptSection: {
          type: "object" as "object",
          title: "",
          properties: {
            defineSetupScriptCheckbox: {
              title:
                "Define setup script to run after host is configured (i.e. task data and artifacts are loaded)",
              type: "boolean",
            },
          },
          dependencies: {
            defineSetupScriptCheckbox: {
              oneOf: [
                {
                  properties: {
                    defineSetupScriptCheckbox: {
                      enum: [true],
                    },
                    setupScript: {
                      title: "Setup Script",
                      type: "string" as "string",
                      default: "",
                      minLength: 1,
                    },
                  },
                },
                {
                  properties: {
                    defineSetupScriptCheckbox: {
                      enum: [false],
                    },
                  },
                },
              ],
            },
          },
        },
        ...(hasValidTask && {
          loadData: {
            title: "",
            type: "object" as "object",
            properties: {
              loadDataOntoHostAtStartup: {
                type: "boolean" as "boolean",
                default: true,
              },
            },
            dependencies: {
              loadDataOntoHostAtStartup: {
                oneOf: [
                  {
                    properties: {
                      loadDataOntoHostAtStartup: {
                        enum: [true],
                      },
                      runProjectSpecificSetupScript: {
                        type: "boolean" as "boolean",
                        title: `Use project-specific setup script defined at ${project?.spawnHostScriptPath}`,
                      },
                      startHosts: {
                        type: "boolean" as "boolean",
                        title:
                          "Also start any hosts this task started (if applicable)",
                      },
                    },
                  },
                ],
              },
            },
          },
        }),
        ...(shouldRenderVolumeSelection && {
          homeVolumeDetails: {
            type: "object" as "object",
            title: "Virtual Workstation",
            properties: {
              selectExistingVolume: {
                title: "Volume selection",
                type: "boolean" as "boolean",
                default: true,
                oneOf: [
                  {
                    type: "boolean" as "boolean",
                    title: "Attach existing volume",
                    enum: [true],
                  },
                  {
                    type: "boolean" as "boolean",
                    title: "Attach new volume",
                    enum: [false],
                  },
                ],
              },
            },
            dependencies: {
              selectExistingVolume: {
                oneOf: [
                  {
                    properties: {
                      selectExistingVolume: {
                        enum: [true],
                      },
                      volumeSelect: {
                        title: "Volume",
                        type: "string" as "string",
                        default: availableVolumes[0]?.id ?? "",
                        minLength: 1,
                        oneOf:
                          availableVolumes.length > 0
                            ? availableVolumes.map((v) => ({
                                type: "string" as "string",
                                title: `(${v.size}GB) ${v.displayName || v.id}`,
                                enum: [v.id],
                              }))
                            : [
                                {
                                  type: "string" as "string",
                                  title: "No volumes available.",
                                  enum: [""],
                                },
                              ],
                      },
                    },
                  },
                  {
                    required: ["volumeSize"],
                    properties: {
                      selectExistingVolume: {
                        enum: [false],
                      },
                      volumeSize: {
                        title: "Volume size (GB)",
                        type: "number" as "number",
                        default: DEFAULT_VOLUME_SIZE,
                        minimum: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
        }),
      },
      dependencies: {
        runUserdataScript: {
          oneOf: [
            {
              properties: {
                runUserdataScript: {
                  enum: [true],
                },
                userdataScript: {
                  title: "Userdata Script",
                  type: "string" as "string",
                },
              },
            },
            {
              properties: {
                runUserdataScript: {
                  enum: [false],
                },
              },
            },
          ],
        },
      },
    },
    uiSchema: {
      requiredSection: {
        "ui:elementWrapperCSS": css`
          display: flex;
        `,
        distro: {
          "ui:widget": DistroDropdown,
          "ui:elementWrapperCSS": dropdownWrapperClassName,
          "ui:data-cy": "distro-input",
          "ui:distros": distros,
        },
        region: {
          "ui:data-cy": "region-select",
          "ui:disabled": isMigration,
          "ui:elementWrapperCSS": dropdownWrapperClassName,
          "ui:placeholder": "Select a region",
          "ui:allowDeselect": false,
        },
      },
      publicKeySection: publicKeys.uiSchema,
      userdataScriptSection: {
        userdataScript: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:data-cy": "user-data-script-text-area",
        },
      },
      setupScriptSection: {
        defineSetupScriptCheckbox: {
          "ui:disabled": useProjectSetupScript,
          "ui:data-cy": "setup-script-checkbox",
        },
        setupScript: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:data-cy": "setup-script-text-area",
        },
      },
      expirationDetails: expirationDetails.uiSchema,
      ...(hasValidTask && {
        loadData: {
          "ui:elementWrapperCSS": loadDataFieldSetCSS,
          loadDataOntoHostAtStartup: {
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
            "ui:customLabel": (
              <>
                Load data for <b>{taskDisplayName}</b> on <b>{buildVariant}</b>{" "}
                {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
                @ <b>{shortenGithash(revision)}</b> onto host at startup (These
                files will typically be in <InlineCode>/data/mci</InlineCode>)
              </>
            ),
            "ui:elementWrapperCSS": dropMarginBottomCSS,
            "ui:data-cy": "load-data-checkbox",
          },
          runProjectSpecificSetupScript: {
            "ui:widget":
              hasValidTask && project?.spawnHostScriptPath
                ? widgets.CheckboxWidget
                : "hidden",
            "ui:disabled": useSetupScript,
            "ui:data-cy": "project-setup-script-checkbox",
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
          startHosts: {
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
        },
      }),
      ...(shouldRenderVolumeSelection && {
        homeVolumeDetails: {
          selectExistingVolume: {
            "ui:widget": isVirtualWorkstation
              ? widgets.RadioBoxWidget
              : "hidden",
          },
          volumeSelect: {
            "ui:allowDeselect": false,
            "ui:data-cy": "volume-select",
            "ui:disabled": availableVolumes?.length === 0,
            "ui:enumDisabled": (volumes || [])
              .filter((v) => !!v.hostID)
              .map((v) => v.id),
          },
          volumeSize: {
            "ui:inputType": "number",
          },
        },
      }),
    },
  };
};

const dropdownWrapperClassName = css`
  max-width: 225px;
`;
const textAreaWrapperClassName = css`
  max-width: 675px;
`;
const indentCSS = css`
  margin-left: 16px;
`;
const dropMarginBottomCSS = css`
  margin-bottom: 0px;
`;
const childCheckboxCSS = css`
  ${indentCSS}
  ${dropMarginBottomCSS}
`;
const loadDataFieldSetCSS = css`
  margin-bottom: 20px;
`;
