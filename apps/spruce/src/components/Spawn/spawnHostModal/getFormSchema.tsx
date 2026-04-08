import { css } from "@emotion/react";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { InlineCode } from "@leafygreen-ui/typography";
import { StyledLink, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { LoadingButton } from "components/Buttons";
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
  SpawnTaskQuery,
  MyVolumesQuery,
} from "gql/generated/types";
import { isFailedTaskStatus } from "utils/statuses";
import { jiraLinkify } from "utils/string";
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
  jiraHost: string;
  jwtTokenForCLIDisabled: boolean;
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
  jiraHost,
  jwtTokenForCLIDisabled,
  myPublicKeys,
  noExpirationCheckboxTooltip,
  spawnTaskData,
  timeZone,
  tokenExchangeState,
  useProjectSetupScript = false,
  useSetupScript = false,
  userAwsRegion,
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
        debugSection: {
          type: "object" as const,
          title: "",
          properties: {
            isDebug: {
              title: "Spawn host in Debug Mode",
              type: "boolean" as const,
              default: false,
            },
          },
          dependencies: {
            isDebug: {
              oneOf: [
                {
                  properties: {
                    isDebug: {
                      enum: [true],
                    },
                    setupStepNumber: {
                      title: "Run task until step number",
                      type: "string" as const,
                      default: "",
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
                      spawnHostTokenAuthBanner: {
                        type: "null" as const,
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
      debugSection: {
        isDebug: {
          "ui:widget":
            hasValidTask && !isDebugDisabled
              ? widgets.CheckboxWidget
              : "hidden",
          "ui:data-cy": "is-debug-toggle",
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
          "ui:description":
            "Debug Mode that allows users to interactively step through task commands on spawn hosts",
        },
        setupStepNumber: {
          ...(executionSteps?.length
            ? {
                "ui:widget": ExecutionStepsDropdown,
                "ui:executionSteps": executionSteps,
                "ui:failingStepNumber": failingStepNumber,
                "ui:isFailedTask": isFailedTask,
              }
            : {}),
          "ui:data-cy": "setup-step-number-input",
          "ui:placeholder": "Select spawn end point",
        },
      },
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
          spawnHostTokenAuthBanner: {
            "ui:showLabel": false,
            "ui:field-data-cy": "spawn-host-token-auth-banner",
            "ui:descriptionNode": (
              <Banner
                data-cy="spawn-host-token-auth-banner"
                variant={Variant.Warning}
              >
                <div data-cy="spawn-host-token-auth-banner-copy">
                  {jwtTokenForCLIDisabled ? (
                    <>
                      As part of {jiraLinkify("DEVPROD-4160", jiraHost)},
                      Evergreen is migrating to temporary credentials for human
                      users. An additional authentication step will soon be
                      required to load task data. You can try the flow before it
                      is required with <strong>Authenticate spawn hosts</strong>{" "}
                      below.
                    </>
                  ) : (
                    <>
                      Spawn hosts require an additional authentication step to
                      load task data. This is part of Evergreens migration to
                      temporary credentials for human users:{" "}
                      {jiraLinkify("DEVPROD-4160", jiraHost)}.
                    </>
                  )}
                </div>
                <LoadingButton
                  data-cy="spawn-host-authenticate-button"
                  disabled={
                    tokenExchangeState === TokenExchangeState.TokenValid
                  }
                  loading={
                    tokenExchangeState === TokenExchangeState.ExchangePending
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
                </LoadingButton>
                {tokenExchangeState === TokenExchangeState.TokenValid && (
                  <div>Host has been temporarily authenticated.</div>
                )}
              </Banner>
            ),
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
