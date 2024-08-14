import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import { IMAGE_EVENT_LIMIT, useEvents } from "pages/image/useEvents";

export const useImageEvents = (
  imageId: string,
  page: number = 0,
  limit: number = IMAGE_EVENT_LIMIT,
) => {
  const dispatchToast = useToastContext();

  const { allEventsFetched, onCompleted } = useEvents();
  const { data, fetchMore, loading } = useQuery<
    ImageEventsQuery,
    ImageEventsQueryVariables
  >(IMAGE_EVENTS, {
    variables: {
      imageId,
      limit,
      page,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ image }) => {
      if (image?.events) {
        onCompleted();
      }
    },
    // onCompleted: () => {
    //   // if (eventLogEntries) {
    //   //   // Initially, set event log entries to show data.
    //   //   setEventLogEntries(data?.image?.events?.eventLogEntries || []);
    //   // }
    // },
    onError: (e) => {
      dispatchToast.error(e.message);
    },
  });
  // const [eventLogEntries, setEventLogEntries] = useState(
  //   data?.image?.events?.eventLogEntries ?? [],
  // );
  // const [allEventLogEntriesFetched, setAllEventLogEntriesFetched] =
  //   useState(false);
  const events = useMemo(
    () => data?.image?.events?.eventLogEntries ?? [],
    [data],
  );

  // console.log(events);
  // console.log("previousData");
  // console.log(previousData);
  // console.log(data === previousData);

  // useEffect(() => {
  //   if (events.length > 0 && events.length < IMAGE_EVENT_LIMIT) {
  //     setAllEventsFetched(true);
  //   }
  // }, [events, setAllEventsFetched]);

  // useEffect(() => {
  //   setPrevCount(previousData?.image?.events?.count ?? 0);
  // }, [previousData, setPrevCount]);

  return {
    // allEventLogEntriesFetched,
    // setAllEventLogEntriesFetched,
    // eventLogEntries,
    // setEventLogEntries,
    allEventsFetched,
    events,
    fetchMore,
    loading,
  };
};
