import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { spacing } from "@leafygreen-ui/tokens";
import { ProgressUpdate } from "./utils";

export const ProgressIndicator: React.FC<ProgressUpdate> = ({
  percentage,
  phase,
}) => (
  <Container>
    <Label>
      <Phase>{phase}</Phase>
    </Label>
    <Track>
      <Fill style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} />
    </Track>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[100]}px;
  width: 100%;
  max-width: 300px;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const Phase = styled.span`
  color: ${palette.gray.dark2};
`;

const Track = styled.div`
  height: 6px;
  border-radius: 3px;
  background-color: ${palette.gray.light2};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 3px;
  background-color: ${palette.green.dark1};
  transition: width 0.3s ease;
`;
