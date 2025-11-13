import { useMemo } from "react";
import styled from "@emotion/styled";
import { AnsiUp } from "ansi_up";
import { format, toZonedTime } from "date-fns-tz";
import parse from "html-react-parser";
import linkifyHtml from "linkify-html";
import { LogMessageFragment } from "gql/generated/types";
import { useUserTimeZone } from "hooks";

const FORMAT_STR = "yyyy/MM/dd HH:mm:ss.SSS";
const ansiUp = new AnsiUp();

export const LogMessageLine: React.FC<LogMessageFragment> = ({
  message,
  severity,
  timestamp,
}) => {
  const tz = useUserTimeZone();
  const time = timestamp
    ? // @ts-expect-error: FIXME. This comment was added by an automated script.
      `[${format(new Date(toZonedTime(timestamp, tz)), FORMAT_STR, {
        timeZone: tz,
      })}] `
    : "";

  const color = getLogColor(severity ?? "");

  const memoizedLogLine = useMemo(() => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const render = linkifyHtml(ansiUp.ansi_to_html(message), {
      validate: {
        url: (value) => /^(http)s?:\/\//.test(value),
      },
    });
    return parse(render);
  }, [message]);

  return (
    <LogLineWrapper color={color}>
      <span className="cy-log-message-time">{time}</span>
      {memoizedLogLine}
    </LogLineWrapper>
  );
};

const LogLineWrapper = styled.div<{ color: string }>`
  ${({ color }) => color && `color: ${color};`}
`;

export const getLogColor = (severity?: string): string => {
  switch (severity) {
    case "D":
    case "DEBUG":
      return "#666";
    case "W":
    case "WARN":
      return "#ffa500";
    case "I":
    case "INFO":
      return "#333";
    case "E":
    case "ERROR":
      return "#ff0000";
    default:
      return "";
  }
};
