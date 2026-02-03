import { Unpacked } from "@evg-ui/lib/types";
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
  staticProviderSettings: {
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    hosts: providerSettings.hosts?.map((h) => ({ name: h.name })) ?? [],
  },
  dockerProviderSettings: {
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    imageUrl: providerSettings.image_url ?? "",
    buildType: (providerSettings.build_type ?? "") as BuildType,
    registryUsername: providerSettings.docker_registry_user ?? "",
    registryPassword: providerSettings.docker_registry_pw ?? "",
  },
  ec2FleetProviderSettings: {
    region: providerSettings.region ?? "",
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    amiId: providerSettings.ami ?? "",
    instanceType: providerSettings.instance_type ?? "",
    sshKeyName: providerSettings.key_name ?? "",
    instanceProfileARN: providerSettings.iam_instance_profile_arn ?? "",
    doNotAssignPublicIPv4Address:
      providerSettings.do_not_assign_public_ipv4_address ?? false,
    elasticIpsEnabled: providerSettings.elastic_ips_enabled ?? false,
    vpcOptions: {
      useVpc: providerSettings.is_vpc ?? false,
      subnetId: providerSettings.subnet_id ?? "",
      subnetPrefix: providerSettings.vpc_name ?? "",
    },
    mountPoints:
      providerSettings.mount_points?.map((mp) => ({
        deviceName: mp.device_name,
        virtualName: mp.virtual_name,
        volumeType: mp.volume_type,
        iops: mp.iops,
        throughput: mp.throughput,
        size: mp.size,
      })) ?? [],
  },
  ec2OnDemandProviderSettings: {
    region: providerSettings.region ?? "",
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    amiId: providerSettings.ami ?? "",
    instanceType: providerSettings.instance_type ?? "",
    sshKeyName: providerSettings.key_name ?? "",
    instanceProfileARN: providerSettings.iam_instance_profile_arn ?? "",
    doNotAssignPublicIPv4Address:
      providerSettings.do_not_assign_public_ipv4_address ?? false,
    elasticIpsEnabled: providerSettings.elastic_ips_enabled ?? false,
    vpcOptions: {
      useVpc: providerSettings.is_vpc ?? false,
      subnetId: providerSettings.subnet_id ?? "",
      subnetPrefix: providerSettings.vpc_name ?? "",
    },
    mountPoints:
      providerSettings.mount_points?.map((mp) => ({
        deviceName: mp.device_name,
        virtualName: mp.virtual_name,
        volumeType: mp.volume_type,
        iops: mp.iops,
        throughput: mp.throughput,
        size: mp.size,
      })) ?? [],
  },
});

type ProviderSettings = ProviderFormState["staticProviderSettings"] &
  ProviderFormState["dockerProviderSettings"] &
  Unpacked<ProviderFormState["ec2FleetProviderSettings"]> &
  Unpacked<ProviderFormState["ec2OnDemandProviderSettings"]>;

export const gqlProviderSettings = (
  providerSettings: Partial<ProviderSettings> = {},
) => {
  const { vpcOptions } = providerSettings;
  return {
    staticProviderSettings: {
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      hosts:
        providerSettings.hosts?.map((h) => ({
          name: h.name,
        })) ?? [],
    },
    dockerProviderSettings: {
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      image_url: providerSettings.imageUrl,
      build_type: providerSettings.buildType,
      docker_registry_user: providerSettings.registryUsername,
      docker_registry_pw: providerSettings.registryPassword,
    },
    ec2FleetProviderSettings: {
      region: providerSettings.region,
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      ami: providerSettings.amiId,
      instance_type: providerSettings.instanceType,
      key_name: providerSettings.sshKeyName,
      iam_instance_profile_arn: providerSettings.instanceProfileARN,
      do_not_assign_public_ipv4_address:
        providerSettings.doNotAssignPublicIPv4Address,
      is_vpc: vpcOptions?.useVpc,
      elastic_ips_enabled: providerSettings.elasticIpsEnabled,
      subnet_id: vpcOptions?.useVpc ? vpcOptions?.subnetId : undefined,
      vpc_name: vpcOptions?.useVpc ? vpcOptions?.subnetPrefix : undefined,
      mount_points:
        providerSettings.mountPoints?.map((mp) => ({
          device_name: mp.deviceName,
          virtual_name: mp.virtualName,
          volume_type: mp.volumeType,
          iops: mp.iops,
          throughput: mp.throughput,
          size: mp.size,
        })) ?? [],
    },
    ec2OnDemandProviderSettings: {
      region: providerSettings.region,
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      ami: providerSettings.amiId,
      instance_type: providerSettings.instanceType,
      key_name: providerSettings.sshKeyName,
      iam_instance_profile_arn: providerSettings.instanceProfileARN,
      do_not_assign_public_ipv4_address:
        providerSettings.doNotAssignPublicIPv4Address,
      is_vpc: vpcOptions?.useVpc,
      elastic_ips_enabled: providerSettings.elasticIpsEnabled,
      subnet_id: vpcOptions?.useVpc ? vpcOptions?.subnetId : undefined,
      vpc_name: vpcOptions?.useVpc ? vpcOptions?.subnetPrefix : undefined,
      mount_points:
        providerSettings.mountPoints?.map((mp) => ({
          device_name: mp.deviceName,
          virtual_name: mp.virtualName,
          volume_type: mp.volumeType,
          iops: mp.iops,
          throughput: mp.throughput,
          size: mp.size,
        })) ?? [],
    },
  };
};
