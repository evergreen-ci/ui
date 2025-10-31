import { trimLogLineToMaxSize } from "../string";

export type DecodeStreamPayload = {
  result: string[];
  trimmedLines: boolean;
};

/**
 * `decodeStream` is a helper function that takes a ReadableStream and returns a Promise that resolves to an array of strings.
 * @param stream - ReadableStream to decode
 * @param lineSizeLimit - the maximum length of a line
 * @returns DecodeStreamPayload - string array of text and boolean indicating whether lines were trimmed
 */
const decodeStream = async (
  stream: ReadableStream,
  lineSizeLimit?: number,
): Promise<DecodeStreamPayload> => {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  const result: string[] = [];
  let trimmedLines = false;

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) {
      return { result, trimmedLines };
    }

    const chunk = decoder.decode(value, { stream: !done });
    const lines = chunk.split(/\r?\n/);

    if (lineSizeLimit !== undefined) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > lineSizeLimit) {
          trimmedLines = true;
          lines[i] = trimLogLineToMaxSize(lines[i], lineSizeLimit);
        }
      }
    }

    if (result.length > 0) {
      // Find the last line we've received so far
      const lastIndex = result.length - 1;
      const lastLine = result[lastIndex];
      // Concatenate the last line with the first line of the "lines" array
      if (
        !lineSizeLimit ||
        lastLine.length + lines[0].length <= lineSizeLimit
      ) {
        result[lastIndex] = lastLine + lines[0];
      } else {
        // If concatenating the line would exceed the limit, trim it
        result[lastIndex] = trimLogLineToMaxSize(
          lastLine + lines[0],
          lineSizeLimit,
        );
        trimmedLines = true;
      }
      // Remove the first line from the "lines" array
      lines.shift();
    }

    result.push(...lines);
  }
};

export { decodeStream };
