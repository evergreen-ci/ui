import { ApolloMock } from "@evg-ui/lib/test_utils/types";
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
          __typename: "Volume",
          availabilityZone: "us-east-1d",
          createdBy: "arjrsatun.psratatel",
          creationTime: new Date("2020-11-05T18:19:39Z"),
          deviceName: null,
          displayName: "",
          expiration: new Date("2020-11-12T18:19:39Z"),
          homeVolume: false,
          host: {
            __typename: "Host",
            displayName: "hai",
            id: "i-0d5d29bf2e7ee342d",
            noExpiration: false,
          },
          hostID: "i-0d5d29bf2e7ee342d",
          id: "vol-0228202a15111023c",
          migrating: false,
          noExpiration: false,
          size: 200,
          type: "gp2",
        },
        {
          __typename: "Volume",
          availabilityZone: "us-east-1d",
          createdBy: "arrastrjun.prastatel",
          creationTime: new Date("2020-11-05T18:18:36Z"),
          deviceName: null,
          displayName: "ramen",
          expiration: new Date("2020-11-12T18:24:09Z"),
          homeVolume: false,
          host: {
            __typename: "Host",
            displayName: "hai",
            id: "i-0d5d29bf2e7ee342d",
            noExpiration: false,
          },
          hostID: "i-0d5d29bf2e7ee342d",
          id: "vol-0d7b1973c71a7cccb",
          migrating: false,
          noExpiration: false,
          size: 100,
          type: "gp2",
        },
      ],
    },
  },
};
