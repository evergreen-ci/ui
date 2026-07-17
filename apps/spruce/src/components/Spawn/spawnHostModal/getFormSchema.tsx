import { css } from "@emotion/react";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { Button } from "@leafygreen-ui/button";
import { InlineCode } from "@leafygreen-ui/typography";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { GetFormSchema } from "components/SpruceForm/types";
import widgets from "components/SpruceForm/Widgets";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import {
  debugSpawnHostsDocumentationUrl,
  getSpawnHostTokenExchangeAuthorizeUrl,
} from "constants/externalResources";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import {
  MyPublicKeysQuery,
  MyVolumesQuery,
  SpawnTaskQuery,
} from "gql/generated/types";
import { isFailedTaskStatus } from "utils/statuses";
import {
  getExpirationDetailsSchema,
  getPublicKeySchema,
} from "../getFormSchema";
import { DEFAULT_VOLUME_SIZE, TokenExchangeState } from "./constants";
import { validateTask } from "./utils";
import { DistroDropdown } from "./Widgets/DistroDropdown";
import {
  ExecutionStepsDropdown,
  stripBlockContext,
  stripFunctionContext,
} from "./Widgets/ExecutionStepsDropdown";

interface Props {
  availableRegions: string[];
  debugSpawnHostDisabled?: boolean;
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
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  noExpirationCheckboxTooltip: string;
  spawnTaskData?: SpawnTaskQuery["task"];
  timeZone: string;
  tokenExchangeState: TokenExchangeState;
  useProjectSetupScript?: boolean;
  useSetupScript?: boolean;
  userAwsRegion?: string;
  volumes: MyVolumesQuery["myVolumes"];
}

export const getFormSchema = ({
  availableRegions,
  debugSpawnHostDisabled = true,
  disableExpirationCheckbox,
  distroIdQueryParam,
  distros,
  hostUptimeWarnings,
  isMigration,
  isVirtualWorkstation,
  myPublicKeys,
  noExpirationCheckboxTooltip,
  spawnTaskData,
  timeZone,
  tokenExchangeState,
  useProjectSetupScript = false,
  userAwsRegion,
  useSetupScript = false,
  volumes,
}: Props): ReturnType<GetFormSchema> => {
  const {
    buildVariant,
    details,
    displayName: taskDisplayName,
    displayStatus,
    executionSteps,
    project,
    revision,
  } = spawnTaskData || {};

  const isFailedTask = isFailedTaskStatus(displayStatus);
  const failingStepNumber = isFailedTask
    ? executionSteps?.find(
        (s) =>
          stripFunctionContext(stripBlockContext(s.displayName)) ===
          details?.description,
      )?.stepNumber
    : undefined;
  const hasValidTask = validateTask(spawnTaskData);
  const hasProjectSetupScript = !!project?.spawnHostScriptPath;
  const shouldRenderVolumeSelection = !isMigration && isVirtualWorkstation;
  const isDebugDisabled =
    debugSpawnHostDisabled || !!project?.debugSpawnHostsDisabled;
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
      properties: {
        debugSection: {
          dependencies: {
            isDebug: {
              oneOf: [
                {
                  properties: {
                    isDebug: {
                      enum: [true],
                    },
                    setupStepNumber: {
                      default: "",
                      title: "Run task until step number",
                      type: "string" as const,
                    },
                  },
                },
                {
                  properties: {
                    isDebug: {
                      enum: [false],
                    },
                  },
                },
              ],
            },
          },
          properties: {
            isDebug: {
              default: false,
              title: "Spawn host in Debug Mode",
              type: "boolean" as const,
            },
          },
          title: "",
          type: "object" as const,
        },
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        expirationDetails: expirationDetails.schema,
        optionalInformationTitle: {
          title: "Optional Host Details",
          type: "null",
        },
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        publicKeySection: publicKeys.schema,
        requiredSection: {
          properties: {
            distro: {
              default: distroIdQueryParam,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              enum: distros?.map(({ name }) => name),
              minLength: 1,
              title: "Distro",
              type: "string" as const,
            },
            region: {
              default:
                userAwsRegion && availableRegions.includes(userAwsRegion)
                  ? userAwsRegion
                  : availableRegions[0],
              minLength: 1,
              oneOf: [
                ...(availableRegions.map((r) => ({
                  enum: [r],
                  title: r,
                  type: "string" as const,
                })) || []),
              ],
              title: "Region",
              type: "string" as const,
            },
          },
          title: "",
          type: "object" as const,
        },
        setupScriptSection: {
          dependencies: {
            defineSetupScriptCheckbox: {
              oneOf: [
                {
                  properties: {
                    defineSetupScriptCheckbox: {
                      enum: [true],
                    },
                    setupScript: {
                      default: "",
                      minLength: 1,
                      title: "Setup Script",
                      type: "string" as const,
                    },
                    warningBanner: {
                      type: "null" as const,
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
          properties: {
            defineSetupScriptCheckbox: {
              title:
                "Define setup script to run after host is configured (i.e. task data and artifacts are loaded)",
              type: "boolean",
            },
          },
          title: "",
          type: "object" as const,
        },
        userdataScriptSection: {
          dependencies: {
            runUserdataScript: {
              oneOf: [
                {
                  properties: {
                    runUserdataScript: {
                      enum: [true],
                    },
                    userdataScript: {
                      default: "",
                      minLength: 1,
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
          properties: {
            runUserdataScript: {
              title: "Run Userdata script on start",
              type: "boolean",
            },
          },
          title: "",
          type: "object" as const,
        },
        ...(hasValidTask && {
          loadData: {
            dependencies: {
              loadDataOntoHostAtStartup: {
                oneOf: [
                  {
                    properties: {
                      loadDataOntoHostAtStartup: {
                        enum: [true],
                      },
                      runProjectSpecificSetupScript: {
                        default: hasProjectSetupScript,
                        title: `Use project-specific setup script defined at ${project?.spawnHostScriptPath}`,
                        type: "boolean" as const,
                      },
                      spawnHostTokenAuthBanner: {
                        type: "null" as const,
                      },
                      startHosts: {
                        title:
                          "Also start any hosts this task started (if applicable)",
                        type: "boolean" as const,
                      },
                    },
                  },
                  {
                    properties: {
                      loadDataOntoHostAtStartup: {
                        enum: [false],
                      },
                    },
                  },
                ],
              },
            },
            properties: {
              loadDataOntoHostAtStartup: {
                default: true,
                type: "boolean" as const,
              },
            },
            title: "",
            type: "object" as const,
          },
        }),
        ...(shouldRenderVolumeSelection && {
          homeVolumeDetails: {
            dependencies: {
              selectExistingVolume: {
                oneOf: [
                  {
                    properties: {
                      selectExistingVolume: {
                        enum: [true],
                      },
                      volumeSelect: {
                        default: availableVolumes[0]?.id ?? "",
                        minLength: 1,
                        oneOf:
                          availableVolumes.length > 0
                            ? availableVolumes.map((v) => ({
                                enum: [v.id],
                                title: `(${v.size}GB) ${v.displayName || v.id}`,
                                type: "string" as const,
                              }))
                            : [
                                {
                                  enum: [""],
                                  title: "No volumes available.",
                                  type: "string" as const,
                                },
                              ],
                        title: "Volume",
                        type: "string" as const,
                      },
                    },
                  },
                  {
                    properties: {
                      selectExistingVolume: {
                        enum: [false],
                      },
                      volumeSize: {
                        default: DEFAULT_VOLUME_SIZE,
                        minimum: 1,
                        title: "Volume size (GB)",
                        type: "number" as const,
                      },
                    },
                    required: ["volumeSize"],
                  },
                ],
              },
            },
            properties: {
              selectExistingVolume: {
                default: true,
                oneOf: [
                  {
                    enum: [true],
                    title: "Attach existing volume",
                    type: "boolean" as const,
                  },
                  {
                    enum: [false],
                    title: "Attach new volume",
                    type: "boolean" as const,
                  },
                ],
                title: "Volume selection",
                type: "boolean" as const,
              },
            },
            title: "Virtual Workstation",
            type: "object" as const,
          },
        }),
      },
      type: "object" as const,
    },
    uiSchema: {
      debugSection: {
        isDebug: {
          "ui:customLabel": (
            <>
              Spawn host in{" "}
              <StyledLink
                css={css`
                  font-weight: bold;
                  text-decoration: underline;
                  color: inherit;
                `}
                hideExternalIcon={false}
                href={debugSpawnHostsDocumentationUrl}
                target="_blank"
              >
                Debug Mode
              </StyledLink>
            </>
          ),
          "ui:data-cy": "is-debug-toggle",
          "ui:description":
            "Debug Mode that allows users to interactively step through task commands on spawn hosts",
          "ui:widget":
            hasValidTask && !isDebugDisabled
              ? widgets.CheckboxWidget
              : "hidden",
        },
        setupStepNumber: {
          ...(executionSteps?.length
            ? {
                "ui:executionSteps": executionSteps,
                "ui:failingStepNumber": failingStepNumber,
                "ui:isFailedTask": isFailedTask,
                "ui:widget": ExecutionStepsDropdown,
              }
            : {}),
          "ui:data-cy": "setup-step-number-input",
          "ui:placeholder": "Select spawn end point",
        },
      },
      expirationDetails: expirationDetails.uiSchema,
      publicKeySection: publicKeys.uiSchema,
      requiredSection: {
        distro: {
          "ui:data-cy": "distro-input",
          "ui:distros": distros,
          "ui:elementWrapperCSS": dropdownWrapperClassName,
          "ui:widget": DistroDropdown,
        },
        region: {
          "ui:allowDeselect": false,
          "ui:data-cy": "region-select",
          "ui:disabled": isMigration || availableRegions.length === 0,
          "ui:elementWrapperCSS": dropdownWrapperClassName,
          "ui:placeholder": "Select a region",
        },
      },
      setupScriptSection: {
        defineSetupScriptCheckbox: {
          "ui:data-cy": "setup-script-checkbox",
          "ui:disabled": useProjectSetupScript,
        },
        setupScript: {
          "ui:data-cy": "setup-script-text-area",
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:widget": LeafyGreenTextArea,
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
      },
      userdataScriptSection: {
        userdataScript: {
          "ui:data-cy": "user-data-script-text-area",
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:widget": LeafyGreenTextArea,
        },
      },
      ...(hasValidTask && {
        loadData: {
          loadDataOntoHostAtStartup: {
            "ui:customLabel": (
              <>
                Load data for <b>{taskDisplayName}</b> on <b>{buildVariant}</b>{" "}
                {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
                @ <b>{shortenGithash(revision)}</b> onto host at startup (These
                files will typically be in <InlineCode>/data/mci</InlineCode>)
              </>
            ),
            "ui:data-cy": "load-data-checkbox",
            "ui:elementWrapperCSS": dropMarginBottomCSS,
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
          },
          runProjectSpecificSetupScript: {
            "ui:data-cy": "project-setup-script-checkbox",
            "ui:disabled": useSetupScript,
            "ui:elementWrapperCSS": childCheckboxCSS,
            "ui:widget":
              hasValidTask && hasProjectSetupScript
                ? widgets.CheckboxWidget
                : "hidden",
          },
          spawnHostTokenAuthBanner: {
            "ui:descriptionNode": (
              <Banner
                data-cy="spawn-host-token-auth-banner"
                variant={Variant.Warning}
              >
                <div data-cy="spawn-host-token-auth-banner-copy">
                  Spawn hosts require an additional authentication step to load
                  task data.
                </div>
                <Button
                  data-cy="spawn-host-authenticate-button"
                  disabled={
                    tokenExchangeState === TokenExchangeState.TokenValid
                  }
                  onClick={() => {
                    window.open(
                      getSpawnHostTokenExchangeAuthorizeUrl(),
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  type="button"
                >
                  Authenticate spawn hosts
                </Button>
                {tokenExchangeState === TokenExchangeState.ExchangePending && (
                  <div>Waiting for authentication to complete...</div>
                )}
                {tokenExchangeState === TokenExchangeState.TokenValid && (
                  <div>Host has been temporarily authenticated.</div>
                )}
              </Banner>
            ),
            "ui:field-data-cy": "spawn-host-token-auth-banner",
            "ui:showLabel": false,
          },
          startHosts: {
            "ui:elementWrapperCSS": childCheckboxCSS,
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
          },
          "ui:elementWrapperCSS": loadDataFieldSetCSS,
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
  max-width: 500px;
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
