import { decodeStream } from ".";

describe("decodeStream", () => {
  it("returns a string array", async () => {
    const stream = createReadableStream(["Hello\nWorld"]);
    const { result } = await decodeStream(stream);
    expect(result).toStrictEqual(["Hello", "World"]);
  });
  it("should ensure partial lines in chunks are not split and are returned as a single line", async () => {
    const readableStream = createReadableStream([
      "Hello W",
      "orld!\n",
      "This is a test",
      "\nof the emergency broadcast system",
    ]);
    const { result } = await decodeStream(readableStream);
    expect(result).toStrictEqual([
      "Hello World!",
      "This is a test",
      "of the emergency broadcast system",
    ]);
  });

  it("should trim a line if it is longer than the line limit", async () => {
    const readableStream = createReadableStream([
      "Hello World!\n",
      "The\nQ",
      "uick brown fox jumped over the lazy dog",
    ]);
    const { result, trimmedLines } = await decodeStream(readableStream, 5);
    expect(trimmedLines).toBe(true);
    expect(result).toStrictEqual(["Hello…", "The", "Quick…"]);
  });

  it("should handle a line that is longer than the line limit spread over multiple chunks", async () => {
    const readableStream = createReadableStream([
      "One\nThis is a single",
      "line that is too lon",
      "g\nNew",
    ]);
    const { result, trimmedLines } = await decodeStream(readableStream, 5);
    expect(trimmedLines).toBe(true);
    expect(result).toStrictEqual(["One", "This …", "New"]);
  });
});

const createReadableStream = (chunks: string[]) => {
  const encoder = new TextEncoder();
  const encodedChunks = chunks.map((chunk) => encoder.encode(chunk));
  const readableStream = new ReadableStream({
    start(controller) {
      encodedChunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
  return readableStream;
};
