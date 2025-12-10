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
  const sourceStream = getBlobStream(file);
  // If no size limit is needed, return the browser-provided stream directly.
  if (fileSizeLimit === undefined) {
    return sourceStream;
  }

  let bytesRead = 0;
  const reader = sourceStream.getReader();

  return new ReadableStream<Uint8Array>({
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
    async cancel(reason) {
      await reader.cancel(reason);
    },
  });
};

const getBlobStream = (file: File): ReadableStream<Uint8Array> => {
  if (typeof file.stream === "function") {
    return file.stream();
  }

  // Some environments (like our test runner) don't provide File.stream().
  // Fall back to manually reading the file in chunks with FileReader.
  let offset = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (offset >= file.size) {
        controller.close();
        return;
      }

      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      offset += CHUNK_SIZE;
      const buffer = await readBlobAsArrayBuffer(chunk);
      controller.enqueue(new Uint8Array(buffer));
    },
  });
};

const readBlobAsArrayBuffer = (blob: Blob): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () =>
      reject(reader.error ?? new Error("Unable to read blob chunk."));
    reader.readAsArrayBuffer(blob);
  });

const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB

export { fileToStream };
