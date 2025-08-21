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
        ec2Key: providers?.aws?.ec2Keys?.[0]?.key ?? "",
        ec2Secret: providers?.aws?.ec2Keys?.[0]?.secret ?? "",
        parameterStorePrefix: parameterStore?.prefix ?? "",
        parserProjectS3Key: providers?.aws?.parserProject?.key ?? "",
        parserProjectS3Secret: providers?.aws?.parserProject?.secret ?? "",
        parserProjectS3Bucket: providers?.aws?.parserProject?.bucket ?? "",
        parserProjectS3Prefix: providers?.aws?.parserProject?.prefix ?? "",
        persistentDNSHostedZoneId:
          providers?.aws?.persistentDNS?.hostedZoneID ?? "",
        persistentDNSDomainName: providers?.aws?.persistentDNS?.domain ?? "",
        generatedJsonFilesS3Prefix:
          providers?.aws?.parserProject?.generatedJSONPrefix ?? "",
        defaultSecurityGroup: providers?.aws?.defaultSecurityGroup ?? "",
        maxVolumeSizePerUser: providers?.aws?.maxVolumeSizePerUser ?? 0,
        allowedInstanceTypes: providers?.aws?.allowedInstanceTypes ?? [],
        alertableInstanceTypes: providers?.aws?.alertableInstanceTypes ?? [],
        allowedRegions: providers?.aws?.allowedRegions ?? [],
        allowedImages: providers?.aws?.pod?.ecs?.allowedImages ?? [],
        maxCPU: providers?.aws?.pod?.ecs?.maxCPU ?? 0,
        maxMemoryMb: providers?.aws?.pod?.ecs?.maxMemoryMb ?? 0,
        role: providers?.aws?.pod?.role ?? "",
        region: providers?.aws?.pod?.region ?? "",
        podSecretManager:
          providers?.aws?.pod?.secretsManager?.secretPrefix ?? "",
        taskDefinitionPrefix:
          providers?.aws?.pod?.ecs?.taskDefinitionPrefix ?? "",
        taskRole: providers?.aws?.pod?.ecs?.taskRole ?? "",
        executionRole: providers?.aws?.pod?.ecs?.executionRole ?? "",
        logRegion: providers?.aws?.pod?.ecs?.logRegion ?? "",
        logGroup: providers?.aws?.pod?.ecs?.logGroup ?? "",
        logStreamPrefix: providers?.aws?.pod?.ecs?.logStreamPrefix ?? "",
        accountRoles:
          providers?.aws?.accountRoles?.map((role) => ({
            account: role.account ?? "",
            role: role.role ?? "",
          })) ?? [],
        awsVPCSubnets: {
          subnets: providers?.aws?.pod?.ecs?.awsVPC?.subnets ?? [],
        },
        awsVPCSecurityGroups: {
          securityGroups:
            providers?.aws?.pod?.ecs?.awsVPC?.securityGroups ?? [],
        },
        clusters:
          providers?.aws?.pod?.ecs?.clusters?.map((cluster) => ({
            name: cluster.name ?? "",
            ...(cluster.os && { os: cluster.os }),
          })) ?? [],
        capacityProviders:
          providers?.aws?.pod?.ecs?.capacityProviders?.map((provider) => ({
            name: provider.name ?? "",
            arch: provider.arch ?? undefined,
            os: provider.os ?? undefined,
            windowsVersion: provider.windowsVersion ?? undefined,
          })) ?? [],
        docker: {
          apiVersion: providers?.docker?.apiVersion ?? "",
        },
        ipamPoolID: providers?.aws?.ipamPoolID ?? "",
        elasticIPUsageRate: providers?.aws?.elasticIPUsageRate ?? 0,
        parserProject: {
          bucket: providers?.aws?.parserProject?.bucket ?? "",
          generatedJSONPrefix:
            providers?.aws?.parserProject?.generatedJSONPrefix ?? "",
          key: providers?.aws?.parserProject?.key ?? "",
          prefix: providers?.aws?.parserProject?.prefix ?? "",
          secret: providers?.aws?.parserProject?.secret ?? "",
        },
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((form: ProvidersFormState) => {
  const { providers } = form;

  return {
    containerPools: {
      pools: providers.containerPools.pools.map((pool) => ({
        id: pool.id,
        distro: pool.distro,
        maxContainers: pool.maxContainers,
        port: pool.port,
      })),
    },
    parameterStore: {
      prefix: providers.aws.parameterStorePrefix || undefined,
    },
    providers: {
      aws: {
        accountRoles: providers.aws.accountRoles.map((role) => ({
          account: role.account,
          role: role.role,
        })),
        alertableInstanceTypes: providers.aws.alertableInstanceTypes,
        allowedInstanceTypes: providers.aws.allowedInstanceTypes,
        allowedRegions: providers.aws.allowedRegions,
        defaultSecurityGroup: providers.aws.defaultSecurityGroup || undefined,
        ec2Keys: [
          {
            name: "default", // We'll use a default name since we flattened this
            key: providers.aws.ec2Key,
            secret: providers.aws.ec2Secret,
          },
        ],
        elasticIPUsageRate: providers.aws.elasticIPUsageRate || undefined,
        ipamPoolID: providers.aws.ipamPoolID || undefined,
        maxVolumeSizePerUser: providers.aws.maxVolumeSizePerUser || undefined,
        parserProject: {
          bucket: providers.aws.parserProjectS3Bucket,
          generatedJSONPrefix:
            providers.aws.generatedJsonFilesS3Prefix || undefined,
          key: providers.aws.parserProjectS3Key || undefined,
          prefix: providers.aws.parserProjectS3Prefix || undefined,
          secret: providers.aws.parserProjectS3Secret,
        },
        persistentDNS: {
          hostedZoneID: providers.aws.persistentDNSHostedZoneId,
          domain: providers.aws.persistentDNSDomainName || undefined,
        },
        pod: {
          region: providers.aws.region || undefined,
          role: providers.aws.role || undefined,
          ecs: {
            allowedImages: providers.aws.allowedImages,
            clusters: providers.aws.clusters.map((cluster) => ({
              name: cluster.name || undefined,
              ...(cluster.os && { os: cluster.os }),
            })),
            capacityProviders: providers.aws.capacityProviders.map(
              (provider) => ({
                name: provider.name || undefined,
                arch: provider.arch || undefined,
                os: provider.os || undefined,
                windowsVersion: provider.windowsVersion || undefined,
              }),
            ),
            taskDefinitionPrefix:
              providers.aws.taskDefinitionPrefix || undefined,
            taskRole: providers.aws.taskRole || undefined,
            executionRole: providers.aws.executionRole || undefined,
            logRegion: providers.aws.logRegion || undefined,
            logGroup: providers.aws.logGroup || undefined,
            logStreamPrefix: providers.aws.logStreamPrefix || undefined,
            maxCPU: providers.aws.maxCPU || undefined,
            maxMemoryMb: providers.aws.maxMemoryMb || undefined,
            awsVPC: {
              subnets: providers.aws.awsVPCSubnets.subnets,
              securityGroups: providers.aws.awsVPCSecurityGroups.securityGroups,
            },
          },
          secretsManager: {
            secretPrefix: providers.aws.podSecretManager,
          },
        },
        subnets: providers.aws.subnets.map((subnet) => ({
          az: subnet.az,
          subnetId: subnet.subnetId,
        })),
      },
      docker: {
        apiVersion: providers.aws.docker.apiVersion || undefined,
      },
    },
  };
}) satisfies FormToGqlFunction<Tab>;
