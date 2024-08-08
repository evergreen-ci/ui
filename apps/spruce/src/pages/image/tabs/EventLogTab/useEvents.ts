import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import { IMAGE_EVENT_LIMIT } from "../../ImageEventLog";

export const useEvents = (
  imageId: string,
  page: number = 0,
  limit: number = IMAGE_EVENT_LIMIT,
) => {
  const dispatchToast = useToastContext();

  const { data, fetchMore, loading } = useQuery<
    ImageEventsQuery,
    ImageEventsQueryVariables
  >(IMAGE_EVENTS, {
    variables: {
      imageId,
      limit,
      page,
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onError: (e) => {
      dispatchToast.error(e.message);
    },
    onCompleted: () => {
      if (events.length === 0) {
        // Initially, set events to show data.
        setEvents(data?.image?.events || []);
      }
    },
  });
  const [events, setEvents] = useState(data?.image?.events ?? []);
  const [allImageEventsFetched, setAllImageEventsFetched] = useState(false);

  useEffect(() => {
    if (events.length > 0 && events.length < IMAGE_EVENT_LIMIT) {
      setAllImageEventsFetched(true);
    }
  }, [events]);

  return {
    allImageEventsFetched,
    setAllImageEventsFetched,
    events,
    setEvents,
    fetchMore,
    loading,
  };
};
