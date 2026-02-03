import { Unpacked } from "@evg-ui/lib/types";
import { reportError } from "@evg-ui/lib/utils";
import { ShortenedRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { PodEventsQuery } from "gql/generated/types";
import { PodEvent } from "types/pod";

interface EventCopyProps {
  "data-cy": string;
  event: Unpacked<PodEventsQuery["pod"]["events"]["eventLogEntries"]>;
}
export const EventCopy: React.FC<EventCopyProps> = ({
  "data-cy": dataCy,
  event,
}) => {
  const { data, eventType } = event;
  const taskLink = (
    <ShortenedRouterLink
      title={data.taskID ?? ""}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      to={getTaskRoute(data.taskID, { execution: data.taskExecution })}
    >
      {data.taskID}
    </ShortenedRouterLink>
  );
  switch (eventType) {
    case PodEvent.StatusChange:
      return (
        <span data-cy={dataCy}>
          Container status changed from <b>{data?.oldStatus}</b> to{" "}
          <b>{data?.newStatus}</b>.
        </span>
      );
    case PodEvent.ContainerTaskFinished:
      return (
        <span data-cy={dataCy}>
          Task {taskLink} finished with status <b>{data?.taskStatus}</b>.
        </span>
      );
    case PodEvent.ClearedTask:
      return <span data-cy={dataCy}>Task {taskLink} cleared.</span>;
    case PodEvent.AssignedTask:
      return <span data-cy={dataCy}>Task {taskLink} assigned.</span>;
    default:
      reportError(
        new Error(`Unrecognized pod event type: ${eventType}`),
      ).severe();
      return null;
  }
};
