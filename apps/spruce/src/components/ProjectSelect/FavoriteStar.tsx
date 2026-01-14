import { useMutation } from "@apollo/client/react";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "@evg-ui/lib/components/Icon";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  AddFavoriteProjectMutation,
  AddFavoriteProjectMutationVariables,
  RemoveFavoriteProjectMutation,
  RemoveFavoriteProjectMutationVariables,
} from "gql/generated/types";
import { ADD_FAVORITE_PROJECT, REMOVE_FAVORITE_PROJECT } from "gql/mutations";

const { gray, green } = palette;

interface FavoriteStarProps {
  projectIdentifier: string;
  isFavorite: boolean;
  ["data-cy"]?: string;
}
export const FavoriteStar: React.FC<FavoriteStarProps> = ({
  "data-cy": dataCy,
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

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavoriteProject({ variables: { projectIdentifier } });
    } else {
      addFavoriteProject({ variables: { projectIdentifier } });
    }
  };
  return (
    <div>
      <IconButton
        aria-label="Add To Favorites"
        data-cy={dataCy}
        onClick={onClick}
      >
        <Icon
          fill={isFavorite ? green.dark1 : gray.dark1}
          glyph={isFavorite ? "Favorite" : "OutlineFavorite"}
        />
      </IconButton>
    </div>
  );
};
