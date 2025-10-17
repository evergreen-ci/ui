import { useQuery } from "@apollo/client";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { useNavigate } from "react-router-dom";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useImageAnalytics } from "analytics";
import { getImageRoute } from "constants/routes";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";

interface ImageSelectProps {
  selectedImage: string;
}

export const ImageSelect: React.FC<ImageSelectProps> = ({ selectedImage }) => {
  const { sendEvent } = useImageAnalytics();
  const navigate = useNavigate();

  const dispatchToast = useToastContext();
  const { data: imagesData, loading } = useQuery<
    ImagesQuery,
    ImagesQueryVariables
  >(IMAGES, {
    onError: (err) => {
      dispatchToast.warning(`Failed to retrieve images: ${err.message}`);
    },
  });

  const { images } = imagesData || {};

  if (!loading) {
    return (
      <Combobox
        clearable={false}
        data-cy="images-select"
        disabled={loading}
        label="Images"
        // @ts-expect-error: onChange expects type string | null
        onChange={(imageId: string) => {
          sendEvent({
            name: "Changed image",
            from: selectedImage,
            to: imageId,
          });
          navigate(getImageRoute(imageId));
        }}
        placeholder="Select an image"
        popoverZIndex={zIndex.popover}
        value={selectedImage}
      >
        {images?.map((image) => (
          <ComboboxOption key={image} value={image}>
            {image}
          </ComboboxOption>
        ))}
      </Combobox>
    );
  }
  return <Skeleton />;
};
