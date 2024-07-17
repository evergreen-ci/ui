import { useQuery } from "@apollo/client";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { zIndex } from "constants/tokens";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";

interface ImageSelectProps {
  selectedImage: string;
}

export const ImageSelect: React.FC<ImageSelectProps> = () => {
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
      placeholder="Images"
      popoverZIndex={zIndex.popover}
      disabled={loading}
    >
      {images?.map((image) => (
        <ComboboxOption key={image} value={image}>
          {image}
        </ComboboxOption>
      ))}
    </Combobox>
  );
};
