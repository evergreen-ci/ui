import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";

type Options = {
  onError?: (error: Error) => void;
};

export const useUser = (options?: Options) => {
  const { data, error, loading } = useQuery<UserQuery, UserQueryVariables>(
    GET_USER,
  );

  useEffect(() => {
    if (error) {
      options?.onError?.(error);
    }
  }, [error, options]);

  const { user } = data || {};
  return { loading, user };
};
