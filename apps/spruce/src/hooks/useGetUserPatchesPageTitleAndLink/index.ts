import { useQuery } from "@apollo/client/react";
import { getUserPatchesRoute } from "constants/routes";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";

interface UserInfo {
  userId: string;
  displayName?: string | null;
}

export const useGetUserPatchesPageTitleAndLink = (
  user?: UserInfo,
  skip: boolean = false,
) => {
  const { data } = useQuery<UserQuery>(USER, {
    skip,
    fetchPolicy: "cache-only",
  });

  if (!data || !user) {
    return null;
  }

  const currentUserId = data.user?.userId;
  const link = getUserPatchesRoute(user.userId);

  if (user.userId === currentUserId) {
    return { link, title: "My Patches" };
  }

  return {
    link,
    title: `${user.displayName || user.userId}'s Patches`,
  };
};
