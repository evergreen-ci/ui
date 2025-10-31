import { Exception, SpanStatusCode, trace } from "@opentelemetry/api";
import {
  StreamedFetchOptions,
  streamedFetch,
} from "@evg-ui/lib/utils/request/streamedFetch";
import { decodeStream } from "@evg-ui/lib/utils/streams";

/**
 * `fetchLogFile` is a utility function that fetches a log file from the server
 * and returns it as an array of strings, one for each line. It uses `streamedFetch`
 * to stream the response body and process it as it comes in. This allows us to
 * avoid loading the entire log file into memory. The function is also instrumented
 * with OpenTelemetry.
 * @param url - the url to fetch
 * @param options - an object containing options for the fetch request
 * @returns an array of strings, one for each line in the log file
 */
const fetchLogFile = async (url: string, options: StreamedFetchOptions) => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("fetchLogFile", {
    attributes: { url },
  });
  try {
    const stream = await streamedFetch(url, options, span);
    const logLines = await decodeStream(stream, options.logLineSizeLimit);
    span.end();
    return logLines;
  } catch (error) {
    span.recordException(error as Exception);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: (error as Error).message,
    });
    span.end();
    throw error;
  }
};

export { streamedFetch, fetchLogFile };
