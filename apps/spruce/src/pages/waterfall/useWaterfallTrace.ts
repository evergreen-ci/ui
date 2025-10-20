import { useEffect, useRef } from "react";
import { trace, Span } from "@opentelemetry/api";

const tracer = trace.getTracer("performance");

export const useWaterfallTrace = () => {
  const resolveRenderRef = useRef<(() => void) | null>(null);
  const renderPromiseRef = useRef<Promise<void> | null>(null);
  const spanRef = useRef<Span | null>(null);

  useEffect(() => {
    // Initialize the promise and resolver only once
    if (renderPromiseRef.current == null) {
      renderPromiseRef.current = new Promise<void>((resolve) => {
        resolveRenderRef.current = resolve;
      });
    }

    // Start the span and set up the promise chain
    if (spanRef.current == null && renderPromiseRef.current) {
      spanRef.current = tracer.startSpan("Render waterfall");
      renderPromiseRef.current.then(() => {
        if (spanRef.current) {
          spanRef.current.end();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (resolveRenderRef.current) {
      resolveRenderRef.current();
    }
  }, []);
};
