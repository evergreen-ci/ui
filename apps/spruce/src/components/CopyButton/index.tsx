import { useEffect, useState } from "react";
import { Button } from "@via-ds/components/button";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";
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
    <TooltipRoot>
      <TooltipTrigger>
        <Button
          aria-label="Copy"
          data-testid="copy-button"
          onPress={copyText}
          size="small"
        >
          {copied ? <Icon glyph="Checkmark" /> : <Icon glyph="Copy" />}
        </Button>
      </TooltipTrigger>
      <Tooltip data-testid="copy-button-tooltip">
        {copied ? "Copied!" : tooltipLabel}
      </Tooltip>
    </TooltipRoot>
  );
};
