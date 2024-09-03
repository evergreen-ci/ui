import styled from "@emotion/styled";
import { Label } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Dropdown from "components/Dropdown";
import { ALL_VALUE, TreeSelect } from "components/TreeSelect";
import { noFilterMessage } from "constants/strings";
import { useQueryParam } from "hooks/useQueryParam";
import { CommitRequesterTypes, MainlineCommitQueryParams } from "types/commits";

const TreeData = [
  {
    title: "All",
    value: ALL_VALUE,
    key: ALL_VALUE,
  },
  {
    value: CommitRequesterTypes.RepotrackerVersionRequester,
    title: "Commits",
    key: CommitRequesterTypes.RepotrackerVersionRequester,
  },
  {
    value: CommitRequesterTypes.GitTagRequester,
    title: "Git Tags",
    key: CommitRequesterTypes.GitTagRequester,
  },
  {
    value: CommitRequesterTypes.TriggerRequester,
    title: "Triggers",
    key: CommitRequesterTypes.TriggerRequester,
  },
  {
    value: CommitRequesterTypes.AdHocRequester,
    title: "Periodic Builds",
    key: CommitRequesterTypes.AdHocRequester,
  },
];

const CommitTypeSelector = () => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });

  const [requesters, setRequesters] = useQueryParam(
    MainlineCommitQueryParams.Requester,
    [],
  );

  const onChange = (value: string[]) => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    setRequesters(value);
    sendEvent({ name: "Filtered by requester", requesters: value });
  };

  return (
    <Container>
      <Label htmlFor="requester-select">Requesters</Label>
      <Dropdown
        buttonText={`Requesters: ${
          requesters.length ? requesters.join(", ") : noFilterMessage
        }`}
        data-cy="requester-select"
      >
        <TreeSelect
          hasStyling={false}
          onChange={onChange}
          state={requesters}
          tData={TreeData}
        />
      </Dropdown>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default CommitTypeSelector;
