import {
  Exception,
  Span,
  SpanStatusCode,
  context,
  trace,
} from "@opentelemetry/api";

/**
 * `streamedFetch` is a utility function that exposes a `ReadableStream` from
 * the response body of a `fetch` request. This allows us to stream the response
 * body and process it as it comes in, rather than waiting for the entire response.
 * The function is instrumented with OpenTelemetry to record spans for the
 * fetch and streaming operations.
 * @param url - the url to fetch
 * @param options - an object containing options for the fetch request
 * @param parentSpan - the OpenTelemetry span to use for tracing
 * @returns a `ReadableStream` from the response body
 */

enum IncompleteDownloadReason {
  ServerError = "SERVER_ERROR",
  FileTooLarge = "FILE_TOO_LARGE",
}

export type StreamedFetchOptions = {
  abortController?: AbortController;
  onProgress?: (progress: number) => void;
  onIncompleteDownload?: (
    reason: IncompleteDownloadReason,
    error?: Error,
  ) => void;
  downloadSizeLimit?: number;
  logLineSizeLimit?: number;
};

export const streamedFetch = async (
  url: string,
  options: StreamedFetchOptions,
  parentSpan: Span,
) => {
  const tracer = trace.getTracer("default");

  try {
    return await context.with(
      trace.setSpan(context.active(), parentSpan),
      async () => {
        const streamedFetchSpan = tracer.startSpan("streamedFetch");
        try {
          const response = await fetch(url, {
            credentials: "include",
            signal: options.abortController
              ? options.abortController.signal
              : undefined,
          });

          if (!response.ok) {
            const errMsg = `Network response was not ok (${response.status})`;
            streamedFetchSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: errMsg,
            });
            throw new Error(errMsg);
          }

          if (!response.body) {
            const errMsg = "Network response has no body";
            streamedFetchSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: errMsg,
            });
            throw new Error(errMsg);
          }

          const reader = response.body.getReader();
          let bytesFetched = 0;

          const stream = new ReadableStream({
            async start(controller) {
              streamedFetchSpan.addEvent("streamedFetchStart", { url });
              try {
                while (true) {
                  if (
                    options?.downloadSizeLimit &&
                    bytesFetched > options.downloadSizeLimit
                  ) {
                    options?.onIncompleteDownload?.(
                      IncompleteDownloadReason.FileTooLarge,
                    );
                    controller.close();
                    break;
                  }
                  // eslint-disable-next-line no-await-in-loop
                  const { done, value } = await reader.read();
                  if (done) {
                    controller.close();
                    break;
                  }
                  if (bytesFetched === 0) {
                    // Record the first chunk received as an event
                    streamedFetchSpan.addEvent("first chunk received", {
                      chunkSize: value?.length ?? 0,
                    });
                  }
                  options?.onProgress?.(value?.length ?? 0);
                  bytesFetched += value?.length ?? 0;

                  controller.enqueue(value);
                }
              } catch (error) {
                // If we've already fetched some bytes, call onIncompleteDownload
                if (bytesFetched > 0) {
                  options?.onIncompleteDownload?.(
                    IncompleteDownloadReason.ServerError,
                    error as Error,
                  );
                  controller.close();
                } else {
                  controller.error(error);
                }
                streamedFetchSpan.recordException(error as Exception);
                streamedFetchSpan.setAttribute("bytes_fetched", bytesFetched);
                streamedFetchSpan.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: (error as Error).message,
                });
              } finally {
                streamedFetchSpan.addEvent("streamedFetchEnd", {
                  bytes_fetched: bytesFetched,
                });
                streamedFetchSpan.setAttribute("bytes_fetched", bytesFetched);
                streamedFetchSpan.end();
                reader.releaseLock();
              }
            },
          });

          return stream;
        } catch (error) {
          streamedFetchSpan.recordException(error as Exception);
          streamedFetchSpan.setStatus({
            code: SpanStatusCode.ERROR,
            message: (error as Error).message,
          });
          streamedFetchSpan.end();
          throw error;
        }
      },
    );
  } catch (error) {
    parentSpan.recordException(error as Exception);
    parentSpan.setStatus({
      code: SpanStatusCode.ERROR,
      message: (error as Error).message,
    });
    parentSpan.end();
    throw error;
  }
};
