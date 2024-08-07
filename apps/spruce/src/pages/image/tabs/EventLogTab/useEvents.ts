import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import { IMAGE_EVENT_LIMIT, useImageEvents } from "../../ImageEventLog";

export const useEvents = (
  imageId: string,
  page: number = 0,
  limit: number = IMAGE_EVENT_LIMIT,
) => {
  const dispatchToast = useToastContext();

  const { allImageEventsFetched, onCompleted } = useImageEvents();
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
    onCompleted: ({ image: events = [] }) => onCompleted(events),
    onError: (e) => {
      dispatchToast.error(e.message);
    },
  });
  const events = data?.image?.events ?? [];

  return { allImageEventsFetched, events, fetchMore, loading };
};
