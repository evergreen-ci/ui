import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { spacing } from "@leafygreen-ui/tokens";
import { Body, Description } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";

type CollapsibleFindingProps = {
  children: React.ReactNode;
  line?: React.ReactNode;
  message: string;
};

export const CollapsibleFinding: React.FC<CollapsibleFindingProps> = ({
  children,
  line,
  message,
}) => (
  <Details>
    <Summary>
      <Caret data-caret glyph="CaretRight" />
      <SummaryText>
        <Body weight="medium">{message}</Body>
        {line && <Description>{line}</Description>}
      </SummaryText>
    </Summary>
    <Content>{children}</Content>
  </Details>
);

const Details = styled.details`
  border: 1px solid ${palette.gray.light2};
  border-radius: 4px;

  &[open] > summary > [data-caret] {
    transform: rotate(90deg);
  }
`;

const Summary = styled.summary`
  display: flex;
  align-items: flex-start;
  gap: ${spacing[100]}px;
  padding: ${spacing[100]}px ${spacing[150]}px;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background-color: ${palette.gray.light3};
  }

  &:focus-visible {
    outline: 2px solid ${palette.blue.base};
    outline-offset: -2px;
  }
`;

const SummaryText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Caret = styled(Icon)`
  flex-shrink: 0;
  margin-top: 2px;
  color: ${palette.gray.dark1};
  transition: transform 120ms ease;
`;

const Content = styled.div`
  padding: 0 ${spacing[200]}px ${spacing[200]}px;
`;
