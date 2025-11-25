import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { useToastContext } from "@evg-ui/lib/context/toast";
import PageTitle from "components/PageTitle";
import PodStatusBadge from "components/PodStatusBadge";
import {
  PageLayout,
  PageSider,
  PageWrapper,
  PageContent,
} from "components/styles";
import { slugs } from "constants/routes";
import { PodQuery, PodQueryVariables } from "gql/generated/types";
import { POD } from "gql/queries";
import { PodStatus } from "types/pod";
import EventsTable from "./EventsTable";
import Metadata from "./Metadata";

const Container = () => {
  const dispatchToast = useToastContext();
  const { [slugs.podId]: podId } = useParams();
  usePageVisibilityAnalytics({
    attributes: { podId: podId ?? "" },
    identifier: "Container",
  });
  const { data, error, loading } = useQuery<PodQuery, PodQueryVariables>(POD, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { podId },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the host: ${err.message}`,
      );
    },
  });
  const { pod } = data || {};
  const { id, status } = pod || {};
  return (
    <PageWrapper data-cy="host-page">
      <PageTitle
        badge={<PodStatusBadge status={status as PodStatus} />}
        loading={loading}
        pageTitle={`Container: ${id}`}
        size="large"
        title={`Container: ${id}`}
      />
      <PageLayout hasSider>
        <PageSider width={350}>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <Metadata error={error} loading={loading} pod={pod} />
        </PageSider>
        <PageContent>
          <EventsTable />
        </PageContent>
      </PageLayout>
    </PageWrapper>
  );
};
export default Container;
