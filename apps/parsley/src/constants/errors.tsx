import { StyledLink } from "@evg-ui/lib/components";
import { getBytesAsString } from "utils/string";
import { docsURL } from "./externalLinks";
import { LOG_LINE_SIZE_LIMIT } from "./logs";

export const LOG_LINE_TOO_LARGE_WARNING = `Parsley was unable to process one or more lines since they exceed the line size limit of ${getBytesAsString(
  LOG_LINE_SIZE_LIMIT,
)}. They have been trimmed to fit the limit.`;

export const LOG_FILE_DOWNLOAD_TOO_LARGE_WARNING = (
  <>
    Parsley was only able to partially download this log. See other download
    methods{" "}
    <StyledLink href={`${docsURL}/Downloading-Logs`} target="__blank">
      here
    </StyledLink>
    .
  </>
);
