import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import { useErrorToast } from "hooks";
import { useEvents } from "hooks/useEvents";

export const IMAGE_EVENT_LIMIT = 5;

export const useImageEvents = (
  imageId: string,
  page: number = 0,
  limit: number = IMAGE_EVENT_LIMIT,
) => {
  const { allEventsFetched, onCompleted, setPrevCount } =
    useEvents(IMAGE_EVENT_LIMIT);
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

  useEffect(() => {
    if (data?.image?.events?.count !== undefined) {
      const previousCount = previousData?.image?.events?.count ?? 0;
      onCompleted(data.image.events.count, previousCount);
    }
  }, [data?.image?.events?.count, previousData, onCompleted]);

  useEffect(() => {
    setPrevCount(previousData?.image?.events?.count ?? 0);
  }, [previousData, setPrevCount]);

  return {
    allEventsFetched,
    events,
    fetchMore,
    loading,
  };
};
