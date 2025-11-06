import { useCallback, useState, useEffect, useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { trace } from "@opentelemetry/api";
import { AnsiUp } from "ansi_up";
import linkifyHtml from "linkify-html";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { constructEvergreenTaskLogURL } from "@evg-ui/lib/constants/logURLTemplates";
import { size } from "@evg-ui/lib/constants/tokens";
import { streamedFetch } from "@evg-ui/lib/utils/request/streamedFetch";
import {
  getSeverityMapping,
  mapLogLevelToColor,
  trimSeverity,
} from "@evg-ui/lib/utils/string/logs";
import {
  CLASSNAME_ACTIVE_LINE,
  styles,
  getLineContainer,
  validateParams,
  ValidatedParams,
} from "./utils";

export const HTMLLog: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLPreElement | null>(null);

  const execution = searchParams.get("execution");
  const origin = searchParams.get("origin");

  const scrollTo = useCallback((lineId: string) => {
    const lineElement = document.getElementById(lineId);
    if (lineElement) {
      lineElement.classList.add(CLASSNAME_ACTIVE_LINE);
      lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    const linkedLineNumber = parseInt(hash.substring(2), 10);

    let params: ValidatedParams;
    try {
      params = validateParams(taskId, execution, origin);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      return;
    }

    if (!containerRef.current) {
      return;
    }

    // Clear container and reset state
    containerRef.current.innerHTML = "";
    setIsLoading(true);
    setError(null);

    // Show container immediately so progressive rendering is visible
    if (containerRef.current) {
      containerRef.current.style.display = "block";
    }

    const url = constructEvergreenTaskLogURL(
      params.taskId,
      params.execution,
      params.origin,
      {
        text: true,
        priority: true,
      },
    );

    const tracer = trace.getTracer("default");
    const span = tracer.startSpan("fetchLogFile", {
      attributes: { url },
    });

    const abortController = new AbortController();

    const fetchStream = async () => {
      let stream: ReadableStream | null = null;
      try {
        stream = await streamedFetch(url, { abortController }, span);
      } catch (err) {
        // Error unless aborted, this prevents errors in strict mode
        if (!abortController.signal.aborted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch stream"),
          );
          setIsLoading(false);
        }
        return;
      } finally {
        span.end();
      }

      if (!stream || !containerRef.current) {
        return;
      }

      if (stream.locked) {
        setError(new Error("Stream is already locked"));
        setIsLoading(false);
        return;
      }

      const textStream = stream.pipeThrough(new TextDecoderStream());

      let lineBuffer = "";
      const lineSplitter = new TransformStream<string, string>({
        transform(chunk, controller) {
          // Combine buffer with new chunk
          const combined = lineBuffer + chunk;
          const lines = combined.split(/\r?\n/);

          // Keep the last incomplete line in buffer
          lineBuffer = lines.pop() || "";

          for (const line of lines) {
            controller.enqueue(line);
          }
        },
        flush(controller) {
          // Enqueue any remaining buffer as the last line
          if (lineBuffer) {
            controller.enqueue(lineBuffer);
            lineBuffer = "";
          }
        },
      });

      const lineStream = textStream.pipeThrough(lineSplitter, {
        signal: abortController.signal,
      });

      const ansiUp = new AnsiUp();

      let lineNumber = 0;
      const htmlStream = new WritableStream<string>({
        async write(chunk) {
          const element = containerRef.current;
          if (!element) {
            return;
          }

          let lineContent = chunk;

          const severity = lineContent.startsWith("[P: ")
            ? getSeverityMapping(Number(lineContent.substring(3, 6)))
            : null;

          if (severity) {
            lineContent = trimSeverity(lineContent);
          }

          const lineContainer = getLineContainer({
            lineNumber,
            htmlContent: linkifyHtml(ansiUp.ansi_to_html(lineContent)),
            color: severity ? mapLogLevelToColor[severity] : undefined,
          });
          element.appendChild(lineContainer);

          // Hide loading skeleton once we have content
          if (lineNumber === 0) {
            setIsLoading(false);
          }

          // Once linked line has been processed, scroll to it
          if (lineNumber === linkedLineNumber) {
            scrollTo(`L${linkedLineNumber}`);
          }

          lineNumber += 1;

          await new Promise(requestAnimationFrame);
        },
        close() {
          setIsLoading(false);
        },
      });

      try {
        await lineStream.pipeTo(htmlStream, {
          signal: abortController.signal,
        });
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to process stream to HTML"),
          );
          setIsLoading(false);
        }
      }
    };

    fetchStream();

    return () => {
      abortController.abort();
    };
  }, [taskId, execution, origin]);

  if (error) {
    return (
      <Container>
        <div>Error loading log: {error.message}</div>
      </Container>
    );
  }

  return (
    <Container>
      {isLoading && <ListSkeleton />}
      <Global styles={styles} />
      <pre ref={containerRef} />
    </Container>
  );
};

const Container = styled.div`
  padding: ${size.m};
`;
