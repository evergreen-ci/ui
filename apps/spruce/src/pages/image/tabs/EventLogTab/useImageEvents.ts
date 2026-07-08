import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";

export const IMAGE_EVENT_LIMIT = 5;

export const useImageEvents = (
  imageId: string,
  page: number = 0,
  limit: number = IMAGE_EVENT_LIMIT,
) => {
  const {
    data,
    error,
    fetchMore: fetchMoreBase,
    loading,
  } = useQuery<ImageEventsQuery, ImageEventsQueryVariables>(IMAGE_EVENTS, {
    variables: {
      imageId,
      limit,
      page,
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });
  useErrorToast(error, "Unable to fetch image events");

  const fetchMore = useCallback(
    (options: Parameters<typeof fetchMoreBase>[0]) =>
      fetchMoreBase({
        ...options,
        updateQuery(
          previousData: ImageEventsQuery,
          { fetchMoreResult }: { fetchMoreResult: ImageEventsQuery },
        ) {
          if (!fetchMoreResult?.image) return previousData;
          return {
            ...previousData,
            image: {
              ...fetchMoreResult.image,
              events: {
                ...fetchMoreResult.image.events,
                eventLogEntries: [
                  ...(previousData.image?.events.eventLogEntries ?? []),
                  ...fetchMoreResult.image.events.eventLogEntries,
                ],
              },
            },
          };
        },
      }),
    [fetchMoreBase],
  );

  const events = useMemo(
    () => data?.image?.events?.eventLogEntries ?? [],
    [data],
  );

  return {
    events,
    fetchMore,
    lastFetchedCount: data?.image?.events?.count,
    loading,
  };
};
