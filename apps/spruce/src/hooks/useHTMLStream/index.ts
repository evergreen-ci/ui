import { useCallback, useState, useEffect, useRef } from "react";
import { trace } from "@opentelemetry/api";
import { useLocation } from "react-router-dom";
import { streamedFetch } from "@evg-ui/lib/utils";
import { CLASSNAME_ACTIVE_LINE, getLineContainer } from "./utils";

const FILE_SIZE_LIMIT = 1024 * 1024 * 1024 * 2.5; // 2.5GB
const BATCH_TIME_MS = 200;

interface UseHTMLStreamOptions {
  url: string | null;
  containerRef: React.RefObject<HTMLPreElement>;
  spanName: string;
  processLine: (lineContent: string) => {
    htmlContent: string;
    style?: React.CSSProperties;
  };
}

export const useHTMLStream = ({
  containerRef,
  processLine,
  spanName,
  url,
}: UseHTMLStreamOptions) => {
  const { hash } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const batchRef = useRef(performance.now());

  // Determine whether batchTime has passed since the last animation frame render
  const shouldPaint = () => {
    const now = performance.now();
    if (now - batchRef.current > BATCH_TIME_MS) {
      batchRef.current = now;
      return true;
    }
    return false;
  };

  const scrollTo = useCallback((lineId: string) => {
    const lineElement = document.getElementById(lineId);
    if (lineElement) {
      lineElement.classList.add(CLASSNAME_ACTIVE_LINE);
      lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    const linkedLineNumber = parseInt(hash.substring(2), 10);

    if (!url) {
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

    const tracer = trace.getTracer("default");
    const span = tracer.startSpan(spanName, {
      attributes: { url },
    });

    const abortController = new AbortController();

    const fetchStream = async () => {
      let stream: ReadableStream | null = null;
      try {
        stream = await streamedFetch(
          url,
          { abortController, downloadSizeLimit: FILE_SIZE_LIMIT },
          span,
        );
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

      const textStream = stream.pipeThrough(new TextDecoderStream(), {
        signal: abortController.signal,
      });

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

      // Using a document fragment to add many lines at once is more performant
      let frag = document.createDocumentFragment();
      let lineNumber = 0;
      let hasStreamedLinkedLine = false;

      const htmlStream = new WritableStream<string>({
        async write(chunk) {
          const element = containerRef.current;
          if (!element) {
            return;
          }

          const { htmlContent, style } = processLine(chunk);

          if (!htmlContent) {
            return;
          }

          const lineContainer = getLineContainer({
            lineNumber,
            htmlContent,
            style,
          });
          frag.appendChild(lineContainer);

          // Hide loading skeleton once we have content
          if (lineNumber === 0) {
            setIsLoading(false);
          }

          // Once linked line has been processed, queue it for scrolling upon render
          if (lineNumber === linkedLineNumber) {
            hasStreamedLinkedLine = true;
          }

          lineNumber += 1;

          if (shouldPaint()) {
            element.appendChild(frag);
            await new Promise(requestAnimationFrame);
            frag = document.createDocumentFragment();

            // scroll to line now that we've called requestAnimationFrame
            if (hasStreamedLinkedLine) {
              scrollTo(`L${linkedLineNumber}`);
              hasStreamedLinkedLine = false;
            }
          }
        },
        async close() {
          // Flush any remaining fragments
          const element = containerRef.current;
          element?.appendChild?.(frag);
          await new Promise(requestAnimationFrame);

          if (hasStreamedLinkedLine) {
            scrollTo(`L${linkedLineNumber}`);
            hasStreamedLinkedLine = false;
          }

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
  }, [url, hash, scrollTo, containerRef, spanName, processLine]);

  return { isLoading, error };
};
