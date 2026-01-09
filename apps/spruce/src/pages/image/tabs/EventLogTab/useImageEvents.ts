import { useMemo } from "react";
import { useQuery } from "@apollo/client";
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
  const { data, error, fetchMore, loading, previousData } = useQuery<
    ImageEventsQuery,
    ImageEventsQueryVariables
  >(IMAGE_EVENTS, {
    variables: {
      imageId,
      limit,
      page,
    },
    notifyOnNetworkStatusChange: true,
  });
  useErrorToast(error, "Unable to fetch image events");

  const events = useMemo(
    () => data?.image?.events?.eventLogEntries ?? [],
    [data],
  );

  return {
    count: data?.image?.events?.count,
    events,
    fetchMore,
    loading,
    previousCount: previousData?.image?.events?.count ?? 0,
  };
};
