import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useEvents } from "components/Settings/EventLog";
import { useToastContext } from "context/toast";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import { IMAGE_EVENT_LIMIT } from "pages/image/ImageEventLog";

export const useImageEvents = (
  imageId: string,
  page: number = 0,
  limit: number = IMAGE_EVENT_LIMIT,
) => {
  const dispatchToast = useToastContext();

  const { allEventsFetched, onCompleted, setPrevCount } =
    useEvents(IMAGE_EVENT_LIMIT);
  const { data, fetchMore, loading, previousData } = useQuery<
    ImageEventsQuery,
    ImageEventsQueryVariables
  >(IMAGE_EVENTS, {
    variables: {
      imageId,
      limit,
      page,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ image }) => onCompleted(image?.events?.count ?? 0),
    onError: (e) => {
      dispatchToast.error(e.message);
    },
  });
  const events = useMemo(
    () => data?.image?.events?.eventLogEntries ?? [],
    [data],
  );

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
