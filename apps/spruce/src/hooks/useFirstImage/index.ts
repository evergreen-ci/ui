import { useQuery } from "@apollo/client/react";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";

/**
 * `useFirstImage` returns the alphabetically first image from Evergreen's list of images.
 * @returns an object containing the image ID (string) and loading state (boolean)
 */
export const useFirstImage = () => {
  const { data, loading } = useQuery<ImagesQuery, ImagesQueryVariables>(IMAGES);

  return { image: data?.images?.[0] ?? "ubuntu2204", loading };
};
