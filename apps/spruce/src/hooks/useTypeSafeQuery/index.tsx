import { OperationVariables } from "@apollo/client";
import { useQuery as useApolloQuery } from "@apollo/client/react";
import { DocumentNode } from "graphql";

export const useTypeSafeQuery = <TData, TVariables extends OperationVariables>(
  query: DocumentNode,
  options?: {
    variables?: TVariables;
    skip?: boolean;
    pollInterval?: number;
    fetchPolicy?: "cache-first" | "network-only" | "cache-and-network";
    errorPolicy?: "none" | "ignore" | "all";
  },
) => {
  const { data, dataState, ...rest } = useApolloQuery<TData, TVariables>(
    query,
    // @ts-expect-error: Empty options should be allowed.
    options ?? {},
  );
  return {
    data: dataState === "complete" ? (data as TData) : undefined,
    ...rest,
  };
};
