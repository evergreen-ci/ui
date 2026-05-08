import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";
import { ProvidersFormState } from "./types";

type Tab = AdminSettingsGeneralSection.Providers;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { containerPools, parameterStore, providers } = data;

  return {
    providers: {
      containerPools: {
        pools:
          containerPools?.pools?.map((pool) => ({
            id: pool.id ?? "",
            distro: pool.distro ?? "",
            maxContainers: pool.maxContainers ?? 0,
            port: pool.port ?? 0,
          })) ?? [],
      },
      aws: {
        subnets:
          providers?.aws?.subnets?.map((subnet) => ({
            az: subnet.az ?? "",
            subnetId: subnet.subnetId ?? "",
          })) ?? [],
        accountRoles:
          providers?.aws?.accountRoles?.map((role) => ({
            account: role.account ?? "",
            role: role.role ?? "",
          })) ?? [],
        ec2Key: providers?.aws?.ec2Keys?.[0]?.key ?? "",
        ec2Secret: providers?.aws?.ec2Keys?.[0]?.secret ?? "",
        parameterStorePrefix: parameterStore?.prefix ?? "",
        defaultSecurityGroup: providers?.aws?.defaultSecurityGroup ?? "",
        maxVolumeSizePerUser: providers?.aws?.maxVolumeSizePerUser ?? 0,
        allowedInstanceTypes: providers?.aws?.allowedInstanceTypes ?? [],
        alertableInstanceTypes: providers?.aws?.alertableInstanceTypes ?? [],
        allowedRegions: providers?.aws?.allowedRegions ?? [],
        ipamPoolID: providers?.aws?.ipamPoolID ?? "",
        elasticIPUsageRate: providers?.aws?.elasticIPUsageRate ?? 0,
        persistentDNS: {
          hostedZoneID: providers?.aws?.persistentDNS?.hostedZoneID ?? "",
          domain: providers?.aws?.persistentDNS?.domain ?? "",
        },
        parserProject: {
          bucket: providers?.aws?.parserProject?.bucket ?? "",
          generatedJSONPrefix:
            providers?.aws?.parserProject?.generatedJSONPrefix ?? "",
          key: providers?.aws?.parserProject?.key ?? "",
          prefix: providers?.aws?.parserProject?.prefix ?? "",
          secret: providers?.aws?.parserProject?.secret ?? "",
        },
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
        id: pool.id,
        distro: pool.distro,
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
            name: "default", // We'll use a default name since we flattened this
            key: aws.ec2Key,
            secret: aws.ec2Secret,
          },
        ],
        elasticIPUsageRate: aws.elasticIPUsageRate || undefined,
        ipamPoolID: aws.ipamPoolID || undefined,
        maxVolumeSizePerUser: aws.maxVolumeSizePerUser || undefined,
        persistentDNS: {
          hostedZoneID: aws.persistentDNS.hostedZoneID,
          domain: aws.persistentDNS.domain || undefined,
        },
        parserProject: {
          bucket: aws.parserProject.bucket,
          generatedJSONPrefix:
            aws.parserProject.generatedJSONPrefix || undefined,
          key: aws.parserProject.key || undefined,
          prefix: aws.parserProject.prefix || undefined,
          secret: aws.parserProject.secret,
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
