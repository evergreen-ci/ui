import { css } from "@emotion/react";
import { InlineCode } from "@leafygreen-ui/typography";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { GetFormSchema } from "components/SpruceForm/types";
import widgets from "components/SpruceForm/Widgets";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import { taskSpawnHostDocumentationUrl } from "constants/externalResources";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import {
  MyPublicKeysQuery,
  SpawnTaskQuery,
  MyVolumesQuery,
} from "gql/generated/types";
import {
  getExpirationDetailsSchema,
  getPublicKeySchema,
} from "../getFormSchema";
import { DEFAULT_VOLUME_SIZE } from "./constants";
import { validateTask } from "./utils";
import { DistroDropdown } from "./Widgets/DistroDropdown";

interface Props {
  availableRegions: string[];
  disableExpirationCheckbox: boolean;
  distroIdQueryParam?: string;
  distros: {
    availableRegions: string[];
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
  jwtTokenForCLIDisabled?: boolean;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  noExpirationCheckboxTooltip: string;
  spawnTaskData?: SpawnTaskQuery["task"];
  timeZone: string;
  useSetupScript?: boolean;
  useProjectSetupScript?: boolean;
  useOAuth?: boolean;
  userAwsRegion?: string;
  volumes: MyVolumesQuery["myVolumes"];
}

export const getFormSchema = ({
  availableRegions,
  disableExpirationCheckbox,
  distroIdQueryParam,
  distros,
  hostUptimeWarnings,
  isMigration,
  isVirtualWorkstation,
  jwtTokenForCLIDisabled = false,
  myPublicKeys,
  noExpirationCheckboxTooltip,
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
  const hasProjectSetupScript = !!project?.spawnHostScriptPath;
  const shouldRenderVolumeSelection = !isMigration && isVirtualWorkstation;
  const availableVolumes = volumes
    ? volumes.filter((v) => v.homeVolume && !v.hostID)
    : [];

  const expirationDetails = getExpirationDetailsSchema({
    disableExpirationCheckbox,
    hostUptimeWarnings,
    isEditModal: false,
    noExpirationCheckboxTooltip,
    permanentlyExempt: false,
    timeZone,
  });
  const publicKeys = getPublicKeySchema({ myPublicKeys });

  return {
    fields: {},
    schema: {
      type: "object" as const,
      properties: {
        requiredSection: {
          type: "object" as const,
          title: "",
          properties: {
            distro: {
              type: "string" as const,
              title: "Distro",
              default: distroIdQueryParam,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              enum: distros?.map(({ name }) => name),
              minLength: 1,
            },
            region: {
              type: "string" as const,
              title: "Region",
              default:
                userAwsRegion && availableRegions.includes(userAwsRegion)
                  ? userAwsRegion
                  : availableRegions[0],
              oneOf: [
                ...(availableRegions.map((r) => ({
                  type: "string" as const,
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
          type: "object" as const,
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
                      type: "string" as const,
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
          type: "object" as const,
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
                    warningBanner: {
                      type: "null" as const,
                    },
                    setupScript: {
                      title: "Setup Script",
                      type: "string" as const,
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
            type: "object" as const,
            properties: {
              loadDataOntoHostAtStartup: {
                type: "boolean" as const,
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
                        type: "boolean" as const,
                        title: `Use project-specific setup script defined at ${project?.spawnHostScriptPath}`,
                        default: hasProjectSetupScript,
                      },
                      startHosts: {
                        type: "boolean" as const,
                        title:
                          "Also start any hosts this task started (if applicable)",
                      },
                      useOAuth: {
                        type: "boolean" as const,
                        title:
                          "Use OAuth authentication to download the task data from Evergreen. This will soon be required, see DEVPROD-4160",
                        default: !jwtTokenForCLIDisabled,
                      },
                    },
                    dependencies: {
                      useOAuth: {
                        oneOf: [
                          {
                            properties: {
                              useOAuth: {
                                enum: [true],
                              },
                              warningBanner: {
                                type: "null" as const,
                              },
                            },
                          },
                        ],
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
            type: "object" as const,
            title: "Virtual Workstation",
            properties: {
              selectExistingVolume: {
                title: "Volume selection",
                type: "boolean" as const,
                default: true,
                oneOf: [
                  {
                    type: "boolean" as const,
                    title: "Attach existing volume",
                    enum: [true],
                  },
                  {
                    type: "boolean" as const,
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
                        type: "string" as const,
                        default: availableVolumes[0]?.id ?? "",
                        minLength: 1,
                        oneOf:
                          availableVolumes.length > 0
                            ? availableVolumes.map((v) => ({
                                type: "string" as const,
                                title: `(${v.size}GB) ${v.displayName || v.id}`,
                                enum: [v.id],
                              }))
                            : [
                                {
                                  type: "string" as const,
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
                        type: "number" as const,
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
                  type: "string" as const,
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
          "ui:disabled": isMigration || availableRegions.length === 0,
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
        warningBanner: {
          "ui:showLabel": false,
          "ui:warnings": [
            <>
              This script is not guaranteed to run or succeed upon host startup.
              Consider opting into{" "}
              <StyledRouterLink
                to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}
              >
                “Spawn host outcome” notifications
              </StyledRouterLink>{" "}
              to monitor the state of setup scripts. If further investigation is
              required, details can be found in the host&apos;s logs.
            </>,
          ],
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
              hasValidTask && hasProjectSetupScript
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
          useOAuth: {
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
            "ui:data-cy": "use-oauth-checkbox",
            "ui:disabled": !jwtTokenForCLIDisabled,
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
          warningBanner: {
            "ui:showLabel": false,
            "ui:warnings": [
              <>
                Spawn hosts with OAuth require additional setup. After SSHing in
                to your spawn host, please run the command{" "}
                <InlineCode>evergreen host fetch</InlineCode>. For more details,
                refer to the{" "}
                <StyledLink
                  hideExternalIcon={false}
                  href={taskSpawnHostDocumentationUrl}
                  target="_blank"
                >
                  documentation
                </StyledLink>
                .
              </>,
            ],
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
