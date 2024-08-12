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
      if (eventLogEntries) {
        // Initially, set event log entries to show data.
        setEventLogEntries(data?.image?.events?.eventLogEntries || []);
      }
    },
  });
  const [eventLogEntries, setEventLogEntries] = useState(
    data?.image?.events?.eventLogEntries ?? [],
  );
  const [allEventLogEntriesFetched, setAllEventLogEntriesFetched] =
    useState(false);

  useEffect(() => {
    if (
      eventLogEntries.length > 0 &&
      eventLogEntries.length < IMAGE_EVENT_LIMIT
    ) {
      setAllEventLogEntriesFetched(true);
    }
  }, [eventLogEntries]);

  return {
    allEventLogEntriesFetched,
    setAllEventLogEntriesFetched,
    eventLogEntries,
    setEventLogEntries,
    fetchMore,
    loading,
  };
};
