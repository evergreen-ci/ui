import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";

type StreamedFileOptions = {
  fileSizeLimit?: number;
};

/**
 * `fileToStream` converts a File object into a ReadableStream without loading the
 * entire file into memory at once. This allows Parsley to handle very large local uploads.
 * @param file - File to convert to a stream
 * @param options - an object containing options for the stream
 * @param options.fileSizeLimit - the maximum number of bytes to stream
 * @returns a ReadableStream
 */
const fileToStream = async (
  file: File,
  options: StreamedFileOptions = {},
): Promise<ReadableStream<Uint8Array>> => {
  const { fileSizeLimit } = options;
  const sourceStream = file.stream();
  // If no size limit is needed, return the browser-provided stream directly.
  if (fileSizeLimit === undefined) {
    return sourceStream;
  }

  let bytesRead = 0;
  const reader = sourceStream.getReader();

  return new ReadableStream<Uint8Array>({
    async cancel(reason) {
      await reader.cancel(reason);
    },
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done || !value) {
        reader.releaseLock();
        controller.close();
        return;
      }

      controller.enqueue(value);
      bytesRead += value.byteLength;
      if (bytesRead > fileSizeLimit) {
        leaveBreadcrumb(
          "File size limit exceeded",
          { bytesRead },
          SentryBreadcrumbTypes.UI,
        );
        await reader.cancel();
        controller.close();
      }
    },
  });
};

export { fileToStream };
