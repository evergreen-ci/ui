import { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";
import { InlineCode, Label } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import {
  getLocalStorageString,
  setLocalStorageString,
} from "@evg-ui/lib/utils/localStorage";
import { LogRenderingTypes } from "constants/enums";
import { LAST_SELECTED_LOG_TYPE } from "constants/storageKeys";

interface ParseLogSelectProps {
  fileName: string | undefined;
  onParse: (logType: LogRenderingTypes | undefined) => void;
  onCancel: () => void;
}

type SelectState =
  | LogRenderingTypes.Resmoke
  | LogRenderingTypes.Default
  | undefined;

const ParseLogSelect: React.FC<ParseLogSelectProps> = ({
  fileName,
  onCancel,
  onParse,
}) => {
  const [logType, setLogType] = useState<SelectState>(
    (getLocalStorageString(LAST_SELECTED_LOG_TYPE) as SelectState) ?? undefined,
  );

  return (
    <ProcessLogsContainer>
      <Label htmlFor="parse-log-select">
        How would you like to parse{" "}
        <StyledInlineCode>{fileName}</StyledInlineCode>?
      </Label>
      <Select
        aria-labelledby="parse-log-select"
        data-cy="parse-log-select"
        onChange={(value) => {
          setLocalStorageString(LAST_SELECTED_LOG_TYPE, value);
          setLogType(value as SelectState);
        }}
        placeholder="Select..."
        value={logType ?? ""}
      >
        <Option value={LogRenderingTypes.Resmoke}>Resmoke</Option>
        <Option value={LogRenderingTypes.Default}>Raw</Option>
      </Select>
      <ButtonContainer>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          data-cy="process-log-button"
          disabled={!logType}
          onClick={() => onParse(logType)}
          variant="primary"
        >
          Process Log
        </Button>
      </ButtonContainer>
    </ProcessLogsContainer>
  );
};

const ProcessLogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${size.xs};
  width: 300px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
  gap: ${size.xs};
`;

const StyledInlineCode = styled(InlineCode)`
  overflow-wrap: anywhere;
`;

export default ParseLogSelect;
