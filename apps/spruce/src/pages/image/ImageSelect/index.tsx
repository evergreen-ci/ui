import { useQuery } from "@apollo/client/react";
import { Combobox, ComboboxItem } from "@via-ds/components/combobox";
import { Skeleton } from "@via-ds/components/skeleton";
import { useNavigate } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
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

  const {
    data: imagesData,
    error,
    loading,
  } = useQuery<ImagesQuery, ImagesQueryVariables>(IMAGES);
  useErrorToast(error, "Failed to retrieve images");

  const { images } = imagesData || {};

  return (
    <Skeleton isLoading={loading}>
      <Combobox
        data-testid="images-select"
        label="Images"
        onChange={(key) => {
          if (key === null) {
            return;
          }
          const imageId = String(key);
          sendEvent({
            name: "Changed image",
            from: selectedImage,
            to: imageId,
          });
          navigate(getImageRoute(imageId));
        }}
        placeholder="Select an image"
        value={selectedImage}
      >
        {(images ?? []).map((image) => (
          <ComboboxItem key={image} id={image} textValue={image}>
            {image}
          </ComboboxItem>
        ))}
      </Combobox>
    </Skeleton>
  );
};
