import { DistroSettingsTabRoutes } from "constants/routes";
import { Provider } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { formProviderSettings, gqlProviderSettings } from "./transformerUtils";
import { ProviderFormState } from "./types";

type Tab = DistroSettingsTabRoutes.Provider;

const toTaskHostOverridesInput = (
  formOverrides: ProviderFormState["taskHostOverrides"],
) =>
  formOverrides.enableTaskHostOverrides
    ? {
        doNotAssignPublicIpv4Address:
          formOverrides.doNotAssignPublicIpv4Address,
        iamInstanceProfileArn: formOverrides.iamInstanceProfileArn,
        providerAccount: formOverrides.providerAccount,
        securityGroupIds: formOverrides.securityGroupIds,
        subnetId: formOverrides.subnetId,
      }
    : null;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    containerPool,
    provider,
    providerAccount,
    providerSettingsList,
    taskHostOverrides,
  } = data;

  return {
    dockerProviderSettings: {
      ...formProviderSettings(providerSettingsList[0]).dockerProviderSettings,
      containerPoolId: containerPool,
      poolMappingInfo: "",
    },
    ec2FleetProviderSettings: providerSettingsList.map((p) => ({
      ...formProviderSettings(p).ec2FleetProviderSettings,
      displayTitle: p.region,
    })),
    provider: {
      providerAccount: providerAccount,
      providerName: provider,
    },
    staticProviderSettings: {
      ...formProviderSettings(providerSettingsList[0]).staticProviderSettings,
    },
    taskHostOverrides: {
      doNotAssignPublicIpv4Address:
        taskHostOverrides?.doNotAssignPublicIpv4Address ?? false,
      enableTaskHostOverrides: taskHostOverrides != null,
      iamInstanceProfileArn: taskHostOverrides?.iamInstanceProfileArn ?? "",
      providerAccount: taskHostOverrides?.providerAccount ?? "",
      securityGroupIds: taskHostOverrides?.securityGroupIds ?? [],
      subnetId: taskHostOverrides?.subnetId ?? "",
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((data, distro) => {
  const {
    provider: { providerName },
  } = data;

  switch (providerName) {
    case Provider.Static:
      return {
        ...distro,
        containerPool: "",
        provider: Provider.Static,
        providerSettingsList: [
          {
            ...gqlProviderSettings(data.staticProviderSettings)
              .staticProviderSettings,
          },
        ],
      };
    case Provider.Docker:
      return {
        ...distro,
        containerPool: data.dockerProviderSettings.containerPoolId,
        provider: Provider.Docker,
        providerSettingsList: [
          {
            ...gqlProviderSettings(data.dockerProviderSettings)
              .dockerProviderSettings,
          },
        ],
      };
    case Provider.Ec2Fleet:
      return {
        ...distro,
        containerPool: "",
        provider: Provider.Ec2Fleet,
        providerAccount: data.provider.providerAccount,
        providerSettingsList: data.ec2FleetProviderSettings.map((p) => ({
          ...gqlProviderSettings(p).ec2FleetProviderSettings,
        })),
        taskHostOverrides: toTaskHostOverridesInput(data.taskHostOverrides),
      };
    default:
      return distro;
  }
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
