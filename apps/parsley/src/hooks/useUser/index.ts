import { useQuery } from "@apollo/client/react";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";

export const useUser = () => {
  const { data, loading } = useQuery<UserQuery, UserQueryVariables>(GET_USER);

  const { user } = data || {};
  return { loading, user };
};
