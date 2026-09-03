import { useMutation } from "@apollo/client/react";
import { Button, ButtonVariant } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
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

  const onPress = (): void => {
    if (isFavorite) {
      removeFavoriteProject({ variables: { projectIdentifier } });
    } else {
      addFavoriteProject({ variables: { projectIdentifier } });
    }
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- propagation shield only; the interactive child is a native button. React Aria strips onClick from Button DOM props, so the stopPropagation from the LG IconButton era moves to this wrapper.
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        aria-label="Add To Favorites"
        data-testid={dataTestId}
        onPress={onPress}
        variant={ButtonVariant.Tertiary}
      >
        <Icon
          fill={
            isFavorite
              ? "var(--via-color-green-500)"
              : "var(--via-color-neutral-500)"
          }
          glyph={isFavorite ? "Favorite" : "OutlineFavorite"}
        />
      </Button>
    </div>
  );
};
