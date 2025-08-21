import { AdminSettingsGeneralSection } from "constants/routes";
import { EcsOperatingSystem } from "gql/generated/types";
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
          generatedJsonFilesS3Prefix:
            providers?.aws?.parserProject?.generatedJSONPrefix ?? "",
        },
        pod: {
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
        },
        docker: {
          apiVersion: providers?.docker?.apiVersion ?? "",
        },
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((form: ProvidersFormState) => {
  const { providers } = form;
  const { aws, containerPools } = providers;

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
        pod: {
          region: aws.pod.region || undefined,
          role: aws.pod.role || undefined,
          ecs: {
            allowedImages: aws.pod.allowedImages,
            clusters: aws.pod.clusters.map((cluster) => ({
              name: cluster.name || undefined,
              ...(cluster.os && { os: cluster.os }),
            })),
            capacityProviders: aws.pod.capacityProviders.map((provider) => ({
              name: provider.name || undefined,
              arch: provider.arch || undefined,
              os: provider.os || undefined,
              windowsVersion:
                provider.os === EcsOperatingSystem.EcsosWindows
                  ? provider.windowsVersion
                  : undefined,
            })),
            taskDefinitionPrefix: aws.pod.taskDefinitionPrefix || undefined,
            taskRole: aws.pod.taskRole || undefined,
            executionRole: aws.pod.executionRole || undefined,
            logRegion: aws.pod.logRegion || undefined,
            logGroup: aws.pod.logGroup || undefined,
            logStreamPrefix: aws.pod.logStreamPrefix || undefined,
            maxCPU: aws.pod.maxCPU || undefined,
            maxMemoryMb: aws.pod.maxMemoryMb || undefined,
            awsVPC: {
              subnets: aws.pod.awsVPCSubnets.subnets,
              securityGroups: aws.pod.awsVPCSecurityGroups.securityGroups,
            },
          },
          secretsManager: {
            secretPrefix: aws.pod.podSecretManager,
          },
        },
        subnets: aws.subnets.map((subnet) => ({
          az: subnet.az,
          subnetId: subnet.subnetId,
        })),
      },
      docker: {
        apiVersion: aws.docker.apiVersion || undefined,
      },
    },
  };
}) satisfies FormToGqlFunction<Tab>;
