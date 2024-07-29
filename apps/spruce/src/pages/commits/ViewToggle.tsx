import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, Overline, OverlineProps } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import {
  ProjectHealthView,
  ProjectHealthViewQuery,
  ProjectHealthViewQueryVariables,
} from "gql/generated/types";
import { PROJECT_HEALTH_VIEW } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { ProjectFilterOptions } from "types/commits";

const { gray } = palette;

type Props = {
  identifier: string;
};

export const ViewToggle: React.FC<Props> = ({ identifier }) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [view, setView] = useQueryParam<ProjectHealthView | null>(
    ProjectFilterOptions.View,
    null,
  );

  const { data } = useQuery<
    ProjectHealthViewQuery,
    ProjectHealthViewQueryVariables
  >(PROJECT_HEALTH_VIEW, {
    variables: { identifier },
    skip: !identifier,
  });

  useEffect(() => {
    if (!view) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      setView(data?.project?.projectHealthView);
    }
  }, [data, setView, view]);

  const onChange = (value: ProjectHealthView) => {
    setView(value);
    sendEvent({
      name: "Toggled icon view mode",
      iconView: value,
    });
  };

  return (
    <>
      <StyledOverline>
        Icon View
        <Tooltip
          align="bottom"
          justify="middle"
          trigger={
            <IconContainer>
              <Icon glyph="InfoWithCircle" size="small" />
            </IconContainer>
          }
          triggerEvent="hover"
        >
          <Body>
            “Default” only shows failed icons in the base view and groups some
            filtered results.
          </Body>
          <Body>“All Tasks” shows icons for every task without grouping.</Body>
        </Tooltip>
      </StyledOverline>
      <SegmentedControl
        aria-controls="[data-cy='waterfall-task-status-icon']"
        name="Icon Tooltip"
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        onChange={onChange}
        value={view || ProjectHealthView.Failed}
      >
        <SegmentedControlOption
          data-cy="view-failed"
          value={ProjectHealthView.Failed}
        >
          Default
        </SegmentedControlOption>
        <SegmentedControlOption
          data-cy="view-all"
          value={ProjectHealthView.All}
        >
          All Tasks
        </SegmentedControlOption>
      </SegmentedControl>
    </>
  );
};

const StyledOverline = styled(Overline)<OverlineProps>`
  color: ${gray.dark1};
`;

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  vertical-align: text-top;
`;
