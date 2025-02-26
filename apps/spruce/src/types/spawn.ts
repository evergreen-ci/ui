import { MyVolumesQuery, MyHostsQuery } from "gql/generated/types";

export type MyVolume = MyVolumesQuery["myVolumes"][0];
export type TableVolume = MyVolume;
export type MyHost = MyHostsQuery["myHosts"][0];

export enum QueryParams {
  Host = "host",
  SpawnHost = "spawnHost",
  Volume = "volume",
}
