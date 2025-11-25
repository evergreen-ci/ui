import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { MenuItem } from "@leafygreen-ui/menu";
import { palette } from "@leafygreen-ui/palette";
import { SplitButton } from "@leafygreen-ui/split-button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import Cookies from "js-cookie";
import Icon from "@evg-ui/lib/components/Icon";
import { transitionDuration } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { copyToClipboard } from "@evg-ui/lib/utils/string";
import { usePreferencesAnalytics } from "analytics";
import { COPY_FORMAT } from "constants/cookies";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { getJiraFormat, getRawLines } from "utils/string";

const COPIED_SUCCESS_DURATION = 1500;

enum CopyFormat {
  Jira = "jira",
  Raw = "raw",
}

export const CopyTextButton: React.FC = () => {
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  return (
    <Tooltip
      align="top"
      enabled={bookmarks.length === 0}
      justify="middle"
      trigger={
        <div>
          <Button bookmarks={bookmarks} />
        </div>
      }
      triggerEvent="hover"
    >
      No bookmarks to copy.
    </Tooltip>
  );
};

const Button: React.FC<{ bookmarks: number[] }> = ({ bookmarks }) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { getLine } = useLogContext();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, COPIED_SUCCESS_DURATION);

      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  const copy = async (
    format: CopyFormat,
    getText: (
      indices: number[],
      getLine: (lineNumber: number) => string | undefined,
    ) => string,
  ) => {
    await copyToClipboard(getText(bookmarks, getLine));
    setCopyDefault(format);
    Cookies.set(COPY_FORMAT, format);
    setCopied(true);
  };

  const copyOptions: {
    [key: string]: {
      label: string;
      handleClick: () => void;
    };
  } = {
    [CopyFormat.Jira]: {
      handleClick: async () => {
        await copy(CopyFormat.Jira, getJiraFormat);
        leaveBreadcrumb("copy-jira", { bookmarks }, SentryBreadcrumbTypes.User);
        sendEvent({ name: "Clicked copy to Jira format button" });
      },
      label: "Copy Jira",
    },
    [CopyFormat.Raw]: {
      handleClick: async () => {
        await copy(CopyFormat.Raw, getRawLines);
        leaveBreadcrumb("copy-raw", { bookmarks }, SentryBreadcrumbTypes.User);
        sendEvent({ name: "Clicked copy raw format button" });
      },
      label: "Copy raw",
    },
  };

  const [copyDefault, setCopyDefault] = useState(
    Cookies.get(COPY_FORMAT) ?? CopyFormat.Jira,
  );
  const { [copyDefault]: primaryOption, ...selectableOptions } = copyOptions;
  return (
    <SplitButton
      css={css`
        /* Apply min-width to avoid elements moving when copied state is shown */
        min-width: 138px;

        button:first-of-type {
          /* Align to left so icon doesn't move during copied state */
          width: 100%;
          & > div {
            justify-content: start;
          }

          & > div > svg {
            transition:
              color ${transitionDuration.default}ms ease-in-out,
              background-image ${transitionDuration.default}ms ease-in-out;

            ${copied && copiedStyling}
          }
        }
      `}
      data-cy="copy-text-button"
      disabled={!bookmarks.length}
      label={copied ? "Copied" : primaryOption.label}
      leftGlyph={<Icon data-testid="copy-glyph" glyph="Copy" />}
      menuItems={Object.values(selectableOptions).map(
        ({ handleClick, label }) => (
          <MenuItem
            key={label}
            glyph={<Icon data-testid="copy-glyph" glyph="Copy" />}
            onClick={handleClick}
          >
            {label}
          </MenuItem>
        ),
      )}
      onClick={primaryOption.handleClick}
    />
  );
};

// Encoded glyph that can be used directly as CSS
const checkmarkWithCircleGlyph = `
background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' data-testid='checkmark-glyph'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM10.4485 4.89583C10.8275 4.45816 11.4983 4.43411 11.9077 4.84352C12.2777 5.21345 12.2989 5.80633 11.9564 6.2018L7.38365 11.4818C7.31367 11.5739 7.22644 11.6552 7.12309 11.7208C6.65669 12.0166 6.03882 11.8783 5.74302 11.4119L3.9245 8.54448C3.6287 8.07809 3.767 7.46021 4.2334 7.16442C4.69979 6.86863 5.31767 7.00693 5.61346 7.47332L6.71374 9.20819L10.4485 4.89583Z' fill='%2300ED64'/%3E%3C/svg%3E");
`;

const copiedStyling = `
color: ${palette.green.base};

${checkmarkWithCircleGlyph}

/* Hide copy glyph while checkmark is shown */
&[data-testid='copy-glyph'] {
  color: transparent;
}`;
