import { useQuery } from "@apollo/client";
import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
} from "gql/generated/types";
import SPRUCE_CONFIG from "gql/queries/spruce-config.graphql";

export const useSpruceConfig = ():
  | SpruceConfigQuery["spruceConfig"]
  | undefined => {
  const { data } = useQuery<SpruceConfigQuery, SpruceConfigQueryVariables>(
    SPRUCE_CONFIG,
  );

  return data?.spruceConfig;
};
