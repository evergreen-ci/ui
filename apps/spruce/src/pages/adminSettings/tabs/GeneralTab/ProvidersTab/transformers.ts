import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";
import { ProvidersFormState } from "./types";

type Tab = AdminSettingsGeneralSection.Providers;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { containerPools, parameterStore, providers } = data;

  return {
    providers: {
      aws: {
        accountRoles:
          providers?.aws?.accountRoles?.map((role) => ({
            account: role.account ?? "",
            role: role.role ?? "",
          })) ?? [],
        alertableInstanceTypes: providers?.aws?.alertableInstanceTypes ?? [],
        allowedInstanceTypes: providers?.aws?.allowedInstanceTypes ?? [],
        allowedRegions: providers?.aws?.allowedRegions ?? [],
        defaultSecurityGroup: providers?.aws?.defaultSecurityGroup ?? "",
        ec2Key: providers?.aws?.ec2Keys?.[0]?.key ?? "",
        ec2Secret: providers?.aws?.ec2Keys?.[0]?.secret ?? "",
        elasticIPUsageRate: providers?.aws?.elasticIPUsageRate ?? 0,
        ipamPoolID: providers?.aws?.ipamPoolID ?? "",
        maxVolumeSizePerUser: providers?.aws?.maxVolumeSizePerUser ?? 0,
        parameterStorePrefix: parameterStore?.prefix ?? "",
        parserProject: {
          bucket: providers?.aws?.parserProject?.bucket ?? "",
          generatedJSONPrefix:
            providers?.aws?.parserProject?.generatedJSONPrefix ?? "",
          key: providers?.aws?.parserProject?.key ?? "",
          prefix: providers?.aws?.parserProject?.prefix ?? "",
          secret: providers?.aws?.parserProject?.secret ?? "",
        },
        persistentDNS: {
          domain: providers?.aws?.persistentDNS?.domain ?? "",
          hostedZoneID: providers?.aws?.persistentDNS?.hostedZoneID ?? "",
        },
        subnets:
          providers?.aws?.subnets?.map((subnet) => ({
            az: subnet.az ?? "",
            subnetId: subnet.subnetId ?? "",
          })) ?? [],
      },
      containerPools: {
        pools:
          containerPools?.pools?.map((pool) => ({
            distro: pool.distro ?? "",
            id: pool.id ?? "",
            maxContainers: pool.maxContainers ?? 0,
            port: pool.port ?? 0,
          })) ?? [],
      },
      docker: {
        apiVersion: providers?.docker?.apiVersion ?? "",
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((form: ProvidersFormState) => {
  const { providers } = form;
  const { aws, containerPools, docker } = providers;

  return {
    containerPools: {
      pools: containerPools.pools.map((pool) => ({
        distro: pool.distro,
        id: pool.id,
        maxContainers: pool.maxContainers,
        port: pool.port,
      })),
    },
    parameterStore: {
      prefix: aws.parameterStorePrefix || undefined,
    },
    providers: {
      aws: {
        accountRoles: aws.accountRoles.map((role) => ({
          account: role.account,
          role: role.role,
        })),
        alertableInstanceTypes: aws.alertableInstanceTypes,
        allowedInstanceTypes: aws.allowedInstanceTypes,
        allowedRegions: aws.allowedRegions,
        defaultSecurityGroup: aws.defaultSecurityGroup || undefined,
        ec2Keys: [
          {
            key: aws.ec2Key,
            name: "default", // We'll use a default name since we flattened this
            secret: aws.ec2Secret,
          },
        ],
        elasticIPUsageRate: aws.elasticIPUsageRate || undefined,
        ipamPoolID: aws.ipamPoolID || undefined,
        maxVolumeSizePerUser: aws.maxVolumeSizePerUser || undefined,
        parserProject: {
          bucket: aws.parserProject.bucket,
          generatedJSONPrefix:
            aws.parserProject.generatedJSONPrefix || undefined,
          key: aws.parserProject.key || undefined,
          prefix: aws.parserProject.prefix || undefined,
          secret: aws.parserProject.secret,
        },
        persistentDNS: {
          domain: aws.persistentDNS.domain || undefined,
          hostedZoneID: aws.persistentDNS.hostedZoneID,
        },
        subnets: aws.subnets.map((subnet) => ({
          az: subnet.az,
          subnetId: subnet.subnetId,
        })),
      },
      docker: {
        apiVersion: docker.apiVersion || undefined,
      },
    },
  };
}) satisfies FormToGqlFunction<Tab>;
