import { useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";

export const IMAGE_EVENT_LIMIT = 5;

const imageEventsUpdateQuery = (
  previousData: ImageEventsQuery,
  { fetchMoreResult }: { fetchMoreResult: ImageEventsQuery },
): ImageEventsQuery => {
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
};

export const useImageEvents = (
  imageId: string,
  page: number = 0,
  limit: number = IMAGE_EVENT_LIMIT,
) => {
  const { data, error, fetchMore, loading } = useQuery<
    ImageEventsQuery,
    ImageEventsQueryVariables
  >(IMAGE_EVENTS, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    variables: {
      imageId,
      limit,
      page,
    },
  });
  useErrorToast(error, "Unable to fetch image events");

  const events = data?.image?.events?.eventLogEntries ?? [];

  const handleFetchMore = useCallback(
    () =>
      fetchMore({
        updateQuery: imageEventsUpdateQuery,
        variables: {
          imageId,
          page: Math.floor(events.length / limit),
        },
      }),
    [events.length, fetchMore, imageId, limit],
  );

  return {
    events,
    handleFetchMore,
    lastFetchedCount: data?.image?.events?.count,
    loading,
  };
};
