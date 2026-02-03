import { forwardRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants";
import AnnotationTicketRow, {
  AnnotationTicketRowProps,
} from "../AnnotationTicketRow";
import { AnnotationTicketAction } from "./AnnotationTicketAction";

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
    const { confidenceScore, issueKey = "", loading, url = "" } = rest;
    return (
      <Container ref={ref} selected={selected}>
        <AnnotationTicketRow {...rest} />
        {!loading && (
          <ButtonContainer>
            <AnnotationTicketAction
              confirmMessage={`Do you want to move this ${issueString} to ${isIssue ? "suspected issues" : "issues"}?`}
              data-cy={`move-btn-${issueKey}`}
              iconGlyph={isIssue ? "ArrowDown" : "ArrowUp"}
              onConfirm={() => {
                onMove({ url, issueKey, confidenceScore });
              }}
              userCanModify={userCanModify}
            />
            <AnnotationTicketAction
              confirmMessage={`Do you want to delete this ${issueString}?`}
              data-cy={`${issueKey}-delete-btn`}
              iconGlyph="Trash"
              onConfirm={() => {
                onRemove(url, issueKey);
              }}
              userCanModify={userCanModify}
            />
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
    selected && `background-color: ${gray.light2};`}
`;

AnnotationTicketRowWithActions.displayName = "AnnotationTicketRowWithActions";

export default AnnotationTicketRowWithActions;
