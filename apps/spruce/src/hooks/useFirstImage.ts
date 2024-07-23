import { useQuery } from "@apollo/client";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";

/**
 * `useFirstImage` returns the alphabetically first image from Evergreen's list of images.
 * This can be used to generate a general link to images settings.
 * @returns an object containing the distro ID (string) and loading state (boolean)
 */
export const useFirstImage = () => {
  const { data, loading } = useQuery<ImagesQuery, ImagesQueryVariables>(IMAGES);

  return { image: data?.images?.[0] ?? "ubuntu2204", loading };
};
