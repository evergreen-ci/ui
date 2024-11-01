import { useEffect } from "react";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("performance");

export const useWaterfallTrace = () => {
  let resolveRender: (v?: any) => void;
  const renderPromise = new Promise((resolve) => {
    resolveRender = resolve;
  });

  useEffect(() => {
    resolveRender();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  tracer.startActiveSpan("Render waterfall", async (span) => {
    renderPromise.then(() => {
      span.end();
    });
  });
};
