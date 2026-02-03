import { ApolloMock } from "@evg-ui/lib/test_utils";
import { MyVolumesQuery, MyVolumesQueryVariables } from "gql/generated/types";
import { MY_VOLUMES } from "gql/queries";

export const myVolumesQueryMock: ApolloMock<
  MyVolumesQuery,
  MyVolumesQueryVariables
> = {
  request: { query: MY_VOLUMES, variables: {} },
  result: {
    data: {
      myVolumes: [
        {
          id: "vol-0228202a15111023c",
          displayName: "",
          createdBy: "arjrsatun.psratatel",
          type: "gp2",
          availabilityZone: "us-east-1d",
          size: 200,
          expiration: new Date("2020-11-12T18:19:39Z"),
          deviceName: null,
          hostID: "i-0d5d29bf2e7ee342d",
          host: {
            displayName: "hai",
            id: "i-0d5d29bf2e7ee342d",
            noExpiration: false,
            __typename: "Host",
          },
          noExpiration: false,
          homeVolume: false,
          creationTime: new Date("2020-11-05T18:19:39Z"),
          migrating: false,
          __typename: "Volume",
        },
        {
          id: "vol-0d7b1973c71a7cccb",
          displayName: "ramen",
          createdBy: "arrastrjun.prastatel",
          type: "gp2",
          availabilityZone: "us-east-1d",
          size: 100,
          expiration: new Date("2020-11-12T18:24:09Z"),
          deviceName: null,
          hostID: "i-0d5d29bf2e7ee342d",
          host: {
            displayName: "hai",
            id: "i-0d5d29bf2e7ee342d",
            noExpiration: false,
            __typename: "Host",
          },
          noExpiration: false,
          homeVolume: false,
          migrating: false,
          creationTime: new Date("2020-11-05T18:18:36Z"),
          __typename: "Volume",
        },
      ],
    },
  },
};
