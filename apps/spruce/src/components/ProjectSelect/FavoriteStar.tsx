import { useMutation } from "@apollo/client/react";
import { Button, ButtonVariant } from "@via-ds/components";
import Favorite from "@via-ds/icons/Favorite";
import OutlineFavorite from "@via-ds/icons/OutlineFavorite";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  AddFavoriteProjectMutation,
  AddFavoriteProjectMutationVariables,
  RemoveFavoriteProjectMutation,
  RemoveFavoriteProjectMutationVariables,
} from "gql/generated/types";
import { ADD_FAVORITE_PROJECT, REMOVE_FAVORITE_PROJECT } from "gql/mutations";

interface FavoriteStarProps {
  projectIdentifier: string;
  isFavorite: boolean;
  ["data-testid"]?: string;
}
export const FavoriteStar: React.FC<FavoriteStarProps> = ({
  "data-testid": dataTestId,
  isFavorite,
  projectIdentifier,
}) => {
  const dispatchToast = useToastContext();

  const [addFavoriteProject] = useMutation<
    AddFavoriteProjectMutation,
    AddFavoriteProjectMutationVariables
  >(ADD_FAVORITE_PROJECT, {
    onCompleted(data) {
      const { addFavoriteProject: project } = data;
      dispatchToast.success(`Added ${project.displayName} to favorites!`);
    },
    onError({ message }) {
      dispatchToast.error(message);
    },
  });

  const [removeFavoriteProject] = useMutation<
    RemoveFavoriteProjectMutation,
    RemoveFavoriteProjectMutationVariables
  >(REMOVE_FAVORITE_PROJECT, {
    onCompleted({ removeFavoriteProject: project }) {
      dispatchToast.success(`Removed ${project.displayName} from favorites!`);
    },
    onError({ message }) {
      dispatchToast.error(message);
    },
  });

  const onPress = () => {
    if (isFavorite) {
      removeFavoriteProject({ variables: { projectIdentifier } });
    } else {
      addFavoriteProject({ variables: { projectIdentifier } });
    }
  };
  return (
    <div>
      <Button
        aria-label="Add To Favorites"
        data-testid={dataTestId}
        onPress={onPress}
        variant={ButtonVariant.Tertiary}
      >
        {isFavorite ? (
          <Favorite fill="var(--via-color-green-500)" />
        ) : (
          <OutlineFavorite fill="var(--via-color-neutral-500)" />
        )}
      </Button>
    </div>
  );
};
