import { Unpacked } from "@evg-ui/lib/types/utils";
import { BuildType, ProviderFormState } from "./types";

/**
 * The provider settings list is untyped in the backend, so we manually define types here.
 */
interface ProviderSettingsList {
  user_data: string;
  merge_user_data_parts: boolean;
  security_group_ids: string[];
  image_url: string;
  build_type: string;
  docker_registry_user: string;
  docker_registry_pw: string;
  hosts: Array<{ name: string; ssh_port: string }>;
  ami: string;
  instance_type: string;
  key_name: string;

  iam_instance_profile_arn: string;
  do_not_assign_public_ipv4_address: boolean;
  is_vpc: boolean;
  subnet_id: string;
  vpc_name: string;
  elastic_ips_enabled: boolean;
  mount_points: Array<{
    device_name: string;
    virtual_name: string;
    volume_type: string;
    iops: number;
    throughput: number;
    size: number;
  }>;
  region: string;
}

export const formProviderSettings = (
  providerSettings: Partial<ProviderSettingsList> = {},
) => ({
  dockerProviderSettings: {
    buildType: (providerSettings.build_type ?? "") as BuildType,
    imageUrl: providerSettings.image_url ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    registryPassword: providerSettings.docker_registry_pw ?? "",
    registryUsername: providerSettings.docker_registry_user ?? "",
    securityGroups: providerSettings.security_group_ids ?? [],
    userData: providerSettings.user_data ?? "",
  },
  ec2FleetProviderSettings: {
    amiId: providerSettings.ami ?? "",
    doNotAssignPublicIPv4Address:
      providerSettings.do_not_assign_public_ipv4_address ?? false,
    elasticIpsEnabled: providerSettings.elastic_ips_enabled ?? false,
    instanceProfileARN: providerSettings.iam_instance_profile_arn ?? "",
    instanceType: providerSettings.instance_type ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    mountPoints:
      providerSettings.mount_points?.map((mp) => ({
        deviceName: mp.device_name,
        iops: mp.iops,
        size: mp.size,
        throughput: mp.throughput,
        virtualName: mp.virtual_name,
        volumeType: mp.volume_type,
      })) ?? [],
    region: providerSettings.region ?? "",
    securityGroups: providerSettings.security_group_ids ?? [],
    sshKeyName: providerSettings.key_name ?? "",
    userData: providerSettings.user_data ?? "",
    vpcOptions: {
      subnetId: providerSettings.subnet_id ?? "",
      subnetPrefix: providerSettings.vpc_name ?? "",
      useVpc: providerSettings.is_vpc ?? false,
    },
  },
  staticProviderSettings: {
    hosts: providerSettings.hosts?.map((h) => ({ name: h.name })) ?? [],
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    userData: providerSettings.user_data ?? "",
  },
});

type ProviderSettings = ProviderFormState["staticProviderSettings"] &
  ProviderFormState["dockerProviderSettings"] &
  Unpacked<ProviderFormState["ec2FleetProviderSettings"]>;

export const gqlProviderSettings = (
  providerSettings: Partial<ProviderSettings> = {},
) => {
  const { vpcOptions } = providerSettings;
  return {
    dockerProviderSettings: {
      build_type: providerSettings.buildType,
      docker_registry_pw: providerSettings.registryPassword,
      docker_registry_user: providerSettings.registryUsername,
      image_url: providerSettings.imageUrl,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      user_data: providerSettings.userData,
    },
    ec2FleetProviderSettings: {
      ami: providerSettings.amiId,
      do_not_assign_public_ipv4_address:
        providerSettings.doNotAssignPublicIPv4Address,
      elastic_ips_enabled: providerSettings.elasticIpsEnabled,
      iam_instance_profile_arn: providerSettings.instanceProfileARN,
      instance_type: providerSettings.instanceType,
      is_vpc: vpcOptions?.useVpc,
      key_name: providerSettings.sshKeyName,
      merge_user_data_parts: providerSettings.mergeUserData,
      mount_points:
        providerSettings.mountPoints?.map((mp) => ({
          device_name: mp.deviceName,
          iops: mp.iops,
          size: mp.size,
          throughput: mp.throughput,
          virtual_name: mp.virtualName,
          volume_type: mp.volumeType,
        })) ?? [],
      region: providerSettings.region,
      security_group_ids: providerSettings.securityGroups,
      subnet_id: vpcOptions?.useVpc ? vpcOptions?.subnetId : undefined,
      user_data: providerSettings.userData,
      vpc_name: vpcOptions?.useVpc ? vpcOptions?.subnetPrefix : undefined,
    },
    staticProviderSettings: {
      hosts:
        providerSettings.hosts?.map((h) => ({
          name: h.name,
        })) ?? [],
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      user_data: providerSettings.userData,
    },
  };
};
