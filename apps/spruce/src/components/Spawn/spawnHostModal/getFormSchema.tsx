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
import styles from "./getFormSchema.module.css";
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
    ? volumes.filter((v) => v.homeVolume && !v.host)
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
          "ui:data-testid": "is-debug-toggle",
          "ui:customLabel": (
            <>
              Spawn host in{" "}
              <StyledLink
                className={styles.debugModeLink}
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
          "ui:data-testid": "setup-step-number-input",
          "ui:placeholder": "Select spawn end point",
        },
      },
      requiredSection: {
        distro: {
          "ui:widget": DistroDropdown,
          "ui:elementWrapperCSS": dropdownWrapperCSS,
          "ui:data-testid": "distro-input",
          "ui:distros": distros,
        },
        region: {
          "ui:data-testid": "region-select",
          "ui:disabled": isMigration || availableRegions.length === 0,
          "ui:elementWrapperCSS": dropdownWrapperCSS,
          "ui:placeholder": "Select a region",
          "ui:allowDeselect": false,
        },
      },
      publicKeySection: publicKeys.uiSchema,
      userdataScriptSection: {
        userdataScript: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperCSS,
          "ui:data-testid": "user-data-script-text-area",
        },
      },
      setupScriptSection: {
        defineSetupScriptCheckbox: {
          "ui:disabled": useProjectSetupScript,
          "ui:data-testid": "setup-script-checkbox",
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
          "ui:elementWrapperCSS": textAreaWrapperCSS,
          "ui:data-testid": "setup-script-text-area",
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
            "ui:data-testid": "load-data-checkbox",
          },
          runProjectSpecificSetupScript: {
            "ui:widget":
              hasValidTask && hasProjectSetupScript
                ? widgets.CheckboxWidget
                : "hidden",
            "ui:disabled": useSetupScript,
            "ui:data-testid": "project-setup-script-checkbox",
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
          startHosts: {
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
          spawnHostTokenAuthBanner: {
            "ui:showLabel": false,
            "ui:field-data-testid": "spawn-host-token-auth-banner",
            "ui:descriptionNode": (
              <Banner
                data-testid="spawn-host-token-auth-banner"
                variant={Variant.Warning}
              >
                <div data-testid="spawn-host-token-auth-banner-copy">
                  Spawn hosts require an additional authentication step to load
                  task data.
                </div>
                <Button
                  data-testid="spawn-host-authenticate-button"
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
            "ui:data-testid": "volume-select",
            "ui:disabled": availableVolumes?.length === 0,
            "ui:enumDisabled": (volumes || [])
              .filter((v) => !!v.host)
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

const dropdownWrapperCSS = { maxWidth: "500px" };
const textAreaWrapperCSS = { maxWidth: "675px" };
const indentCSS = { marginLeft: "16px" };
const dropMarginBottomCSS = { marginBottom: "0px" };
const childCheckboxCSS = { ...indentCSS, ...dropMarginBottomCSS };
const loadDataFieldSetCSS = { marginBottom: "20px" };
