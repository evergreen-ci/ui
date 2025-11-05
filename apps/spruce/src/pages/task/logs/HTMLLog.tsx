import { useCallback, useState, useEffect, useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { trace } from "@opentelemetry/api";
import { AnsiUp } from "ansi_up";
import linkifyHtml from "linkify-html";
import { useParams, useSearchParams } from "react-router-dom";
import { constructEvergreenTaskLogURL } from "@evg-ui/lib/constants/logURLTemplates";
import { size } from "@evg-ui/lib/constants/tokens";
import { streamedFetch } from "@evg-ui/lib/utils/request/streamedFetch";
import {
  getSeverityMapping,
  mapLogLevelToColor,
  trimSeverity,
} from "@evg-ui/lib/utils/string/logs";
import { styles, getLineContainer } from "./utils";

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: ${size.m};
`;

const ContentWrapper = styled.pre``;

export const HTMLLog: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLPreElement | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);

  // Extract stable values for dependencies
  const execution = searchParams.get("execution");
  const origin = searchParams.get("origin");
  const { hash } = window.location;

  const scrollTo = useCallback((lineId: string) => {
    const lineElement = document.getElementById(lineId);
    if (lineElement) {
      lineElement.classList.add("selected-line");
      lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    if (!taskId) {
      setError(new Error("Task ID not specified"));
      setIsLoading(false);
      return;
    }

    const executionNum = parseInt(execution || "", 10);
    if (isNaN(executionNum)) {
      setError(new Error("Execution not specified"));
      setIsLoading(false);
      return;
    }

    if (!origin) {
      setError(new Error("Log origin type not specified"));
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

    const url = constructEvergreenTaskLogURL(taskId, executionNum, origin, {
      text: true,
      priority: true,
    });

    const tracer = trace.getTracer("default");
    const span = tracer.startSpan("fetchLogFile", {
      attributes: { url },
    });

    const fetchStream = async () => {
      let stream: ReadableStream | null = null;
      try {
        stream = await streamedFetch(url, {}, span);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch stream"),
        );
        setIsLoading(false);
        span.end();
        return;
      }

      if (!stream || !containerRef.current) {
        if (stream) {
          span.end();
        }
        return;
      }

      // Check if stream is already locked
      if (stream.locked) {
        setError(new Error("Stream is already locked"));
        setIsLoading(false);
        span.end();
        return;
      }

      const textStream = stream.pipeThrough(new TextDecoderStream());

      // Create a TransformStream to split text into lines
      let lineBuffer = "";
      const lineSplitter = new TransformStream<string, string>({
        transform(chunk, controller) {
          // Combine buffer with new chunk
          const combined = lineBuffer + chunk;
          const lines = combined.split(/\r?\n/);

          // Keep the last incomplete line in buffer
          lineBuffer = lines.pop() || "";

          // Enqueue complete lines
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

      const lineStream = textStream.pipeThrough(lineSplitter);
      let reader: ReadableStreamDefaultReader<string>;

      try {
        reader = lineStream.getReader() as ReadableStreamDefaultReader<string>;
        readerRef.current = reader;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to get stream reader"),
        );
        setIsLoading(false);
        span.end();
        return;
      }

      const element = containerRef.current;
      if (!element) {
        return;
      }

      // Create ansiUp instance to convert ANSI escape codes to HTML
      const ansiUp = new AnsiUp();

      // Process lines from the stream
      let lineNumber = 0;
      const processStream = async () => {
        try {
          while (true) {
            // Check if reader is still valid
            if (readerRef.current !== reader) {
              break;
            }

            // eslint-disable-next-line no-await-in-loop
            const { done, value } = await reader.read();

            // Check again after async operation
            if (readerRef.current !== reader) {
              break;
            }

            if (done) {
              break;
            }

            if (value && element) {
              // Check for priority prefix and extract severity
              let lineContent = value;
              let lineColor: string | undefined;

              const severity = lineContent.startsWith("[P: ")
                ? getSeverityMapping(Number(lineContent.substring(3, 6)))
                : null;

              if (severity) {
                // Trim "[P: NN] " priority prefix
                lineContent = trimSeverity(lineContent);
                lineColor = mapLogLevelToColor[severity];
              }

              // Convert ANSI escape codes to HTML
              const htmlContent = linkifyHtml(ansiUp.ansi_to_html(lineContent));

              const lineContainer = getLineContainer(
                lineNumber,
                htmlContent,
                lineColor,
              );
              element.appendChild(lineContainer);

              // Hide loading skeleton once we have content
              if (lineNumber === 0) {
                setIsLoading(false);
              }

              if (lineNumber === parseInt(hash.substring(2), 10)) {
                scrollTo(hash.substring(1));
              }

              lineNumber += 1;

              // Yield to browser after each line for progressive rendering
              // eslint-disable-next-line no-await-in-loop
              await new Promise(requestAnimationFrame);
            }
          }

          reader.releaseLock();
          if (readerRef.current === reader) {
            readerRef.current = null;
          }
          setIsLoading(false);
        } catch (err) {
          if (reader && readerRef.current === reader) {
            try {
              reader.releaseLock();
            } catch {
              // Ignore if already released
            }
            readerRef.current = null;
          }
          setError(
            err instanceof Error ? err : new Error("Failed to process stream"),
          );
          setIsLoading(false);
        } finally {
          span.end();
        }
      };

      processStream();
    };

    fetchStream();

    return () => {
      if (readerRef.current) {
        readerRef.current.cancel().catch(() => {
          // Ignore cancellation errors
        });
        readerRef.current = null;
      }
    };
  }, [taskId, execution, origin]);

  if (error) {
    return (
      <Container>
        <ContentWrapper>
          <div>Error loading log: {error.message}</div>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      {isLoading && <ListSkeleton />}
      <Global styles={styles} />
      <ContentWrapper ref={containerRef} />
      {!isLoading &&
        !error &&
        containerRef.current &&
        containerRef.current.children.length === 0 && (
          <ContentWrapper>No content received</ContentWrapper>
        )}
    </Container>
  );
};
