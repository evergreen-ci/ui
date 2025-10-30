import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Tooltip, TriggerEvent } from "@leafygreen-ui/tooltip";
import Icon from "@evg-ui/lib/components/Icon";
import { copyToClipboard } from "@evg-ui/lib/utils/string";

interface Props {
  textToCopy: string;
  tooltipLabel: string;
}

const COPY_TIMEOUT = 1500;

export const CopyButton: React.FC<Props> = ({ textToCopy, tooltipLabel }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, COPY_TIMEOUT);

      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  const copyText = async () => {
    await copyToClipboard(textToCopy);
    setCopied(true);
  };

  return (
    <Tooltip
      data-cy="copy-button-tooltip"
      trigger={
        <StyledIconButton
          aria-label="Copy text to clipboard"
          data-cy="copy-button"
          onClick={copyText}
        >
          <Icon glyph="Copy" />
        </StyledIconButton>
      }
      triggerEvent={TriggerEvent.Hover}
    >
      {copied ? "Copied!" : tooltipLabel}
    </Tooltip>
  );
};

const StyledIconButton = styled(IconButton)`
  max-height: 16px;
  max-width: 16px;
`;
