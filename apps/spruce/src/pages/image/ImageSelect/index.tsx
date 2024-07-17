import { useQuery } from "@apollo/client";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useNavigate } from "react-router-dom";
import { getImageRoute } from "constants/routes";
import { zIndex } from "constants/tokens";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";

interface ImageSelectProps {
  selectedImage: string;
}

export const ImageSelect: React.FC<ImageSelectProps> = ({ selectedImage }) => {
  const navigate = useNavigate();

  const { data: imagesData, loading } = useQuery<
    ImagesQuery,
    ImagesQueryVariables
  >(IMAGES);

  const { images } = imagesData || {};

  return loading ? null : (
    <Combobox
      clearable={false}
      data-cy="images-select"
      label="Images"
      placeholder="Select an image"
      popoverZIndex={zIndex.popover}
      disabled={loading}
      // @ts-expect-error: onChange expects type string | null
      onChange={(imageId: string) => {
        navigate(getImageRoute(imageId));
      }}
      value={selectedImage}
    >
      {images?.map((image) => (
        <ComboboxOption key={image} value={image}>
          {image}
        </ComboboxOption>
      ))}
    </Combobox>
  );
};
