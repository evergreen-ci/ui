import { useQuery } from "@apollo/client/react";
import { getUserPatchesRoute } from "constants/routes";
import { User, UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";

type UserPatchesPageData = {
  link: string;
  title: string;
};

export const useGetUserPatchesPageTitleAndLink = (
  user: Pick<User, "displayName" | "userId"> | undefined,
): UserPatchesPageData | null => {
  const { data } = useQuery<UserQuery>(USER);

  if (!data?.user || !user) {
    return null;
  }

  const link = getUserPatchesRoute(user.userId);

  if (user.userId === data.user.userId) {
    return { link, title: "My Patches" };
  }

  return {
    link,
    title: `${user.displayName || user.userId}'s Patches`,
  };
};
