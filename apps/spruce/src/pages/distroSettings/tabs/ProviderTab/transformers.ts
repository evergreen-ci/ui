import { DistroSettingsTabRoutes } from "constants/routes";
import { Provider } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { gqlProviderSettings, formProviderSettings } from "./transformerUtils";
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
    provider: {
      providerName: provider,
      providerAccount: providerAccount,
    },
    staticProviderSettings: {
      ...formProviderSettings(providerSettingsList[0]).staticProviderSettings,
    },
    dockerProviderSettings: {
      ...formProviderSettings(providerSettingsList[0]).dockerProviderSettings,
      containerPoolId: containerPool,
      poolMappingInfo: "",
    },
    ec2FleetProviderSettings: providerSettingsList.map((p) => ({
      ...formProviderSettings(p).ec2FleetProviderSettings,
      displayTitle: p.region,
    })),
    ec2OnDemandProviderSettings: providerSettingsList.map((p) => ({
      ...formProviderSettings(p).ec2OnDemandProviderSettings,
      displayTitle: p.region,
    })),
    taskHostOverrides: {
      enableTaskHostOverrides: taskHostOverrides != null,
      doNotAssignPublicIpv4Address:
        taskHostOverrides?.doNotAssignPublicIpv4Address ?? false,
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
        provider: Provider.Static,
        providerSettingsList: [
          {
            ...gqlProviderSettings(data.staticProviderSettings)
              .staticProviderSettings,
          },
        ],
        containerPool: "",
      };
    case Provider.Docker:
      return {
        ...distro,
        provider: Provider.Docker,
        providerSettingsList: [
          {
            ...gqlProviderSettings(data.dockerProviderSettings)
              .dockerProviderSettings,
          },
        ],
        containerPool: data.dockerProviderSettings.containerPoolId,
      };
    case Provider.Ec2Fleet:
      return {
        ...distro,
        provider: Provider.Ec2Fleet,
        providerAccount: data.provider.providerAccount,
        providerSettingsList: data.ec2FleetProviderSettings.map((p) => ({
          ...gqlProviderSettings(p).ec2FleetProviderSettings,
        })),
        containerPool: "",
        taskHostOverrides: toTaskHostOverridesInput(data.taskHostOverrides),
      };
    case Provider.Ec2OnDemand:
      return {
        ...distro,
        provider: Provider.Ec2OnDemand,
        providerAccount: data.provider.providerAccount,
        providerSettingsList: data.ec2OnDemandProviderSettings.map((p) => ({
          ...gqlProviderSettings(p).ec2OnDemandProviderSettings,
        })),
        containerPool: "",
        taskHostOverrides: toTaskHostOverridesInput(data.taskHostOverrides),
      };
    default:
      return distro;
  }
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies FormToGqlFunction<Tab>;
