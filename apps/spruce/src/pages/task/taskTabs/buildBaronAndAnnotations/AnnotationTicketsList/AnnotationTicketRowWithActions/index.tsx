import { forwardRef } from "react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Tooltip } from "@leafygreen-ui/tooltip";
import ConditionalWrapper from "@evg-ui/lib/components/ConditionalWrapper";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { size } from "@evg-ui/lib/constants/tokens";
import AnnotationTicketRow, {
  AnnotationTicketRowProps,
} from "../AnnotationTicketRow";

const { gray } = palette;
interface AnnotationTicketRowWithActionsProps extends AnnotationTicketRowProps {
  onRemove: (url: string, issueKey: string) => void;
  userCanModify: boolean;
  onMove: ({
    confidenceScore,
    issueKey,
    url,
  }: {
    url: string;
    issueKey?: string;
    confidenceScore?: number;
  }) => void;
  issueString: string;
  isIssue: boolean;
  selected: boolean;
}

const AnnotationTicketRowWithActions = forwardRef<
  HTMLDivElement,
  AnnotationTicketRowWithActionsProps
>(
  (
    {
      isIssue,
      issueString,
      onMove,
      onRemove,
      selected,
      userCanModify,
      ...rest
    },
    ref,
  ) => {
    const { confidenceScore, issueKey, loading, url } = rest;
    return (
      <Container ref={ref} selected={selected}>
        <AnnotationTicketRow {...rest} />
        {!loading && (
          <ButtonContainer>
            {ConditionalWrapper({
              condition: userCanModify,
              wrapper: (children) => (
                <Popconfirm
                  align="right"
                  onConfirm={() => {
                    // @ts-expect-error: FIXME. This comment was added by an automated script.
                    onMove({ url, issueKey, confidenceScore });
                  }}
                  trigger={children as JSX.Element}
                >
                  Do you want to move this {issueString} to{" "}
                  {isIssue ? "suspected issues" : "issues"}?
                </Popconfirm>
              ),
              altWrapper: (children) => (
                <Tooltip trigger={children as JSX.Element}>
                  You are not authorized to edit failure details
                </Tooltip>
              ),
              children: (
                <Button
                  data-cy={`move-btn-${issueKey}`}
                  disabled={!userCanModify}
                  leftGlyph={<Icon glyph={isIssue ? "ArrowDown" : "ArrowUp"} />}
                  size={Size.Small}
                >
                  Move to {isIssue ? "suspected issues" : "issues"}
                </Button>
              ),
            })}
            {ConditionalWrapper({
              condition: userCanModify,
              wrapper: (children) => (
                <Popconfirm
                  align="right"
                  onConfirm={() => {
                    // @ts-expect-error: FIXME. This comment was added by an automated script.
                    onRemove(url, issueKey);
                  }}
                  trigger={children as JSX.Element}
                >
                  Do you want to delete this {issueString}?
                </Popconfirm>
              ),
              altWrapper: (children) => (
                <Tooltip trigger={children as JSX.Element}>
                  You are not authorized to edit failure details
                </Tooltip>
              ),
              children: (
                <Button
                  data-cy={`${issueKey}-delete-btn`}
                  disabled={!userCanModify}
                  leftGlyph={<Icon glyph="Trash" />}
                  size="small"
                />
              ),
            })}
          </ButtonContainer>
        )}
      </Container>
    );
  },
);

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${size.xs};
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${size.xs};
  ${({ selected }: { selected?: boolean }) =>
    selected &&
    `
    background-color: ${gray.light2};
  `}
`;

AnnotationTicketRowWithActions.displayName = "AnnotationTicketRowWithActions";

export default AnnotationTicketRowWithActions;
