import { fileToStream } from ".";

describe("fileToStream", () => {
  beforeEach(() => {
    if (typeof File !== "undefined" && !File.prototype.stream) {
      File.prototype.stream = function stream(): ReadableStream<
        Uint8Array<ArrayBuffer>
      > {
        const fileSize = this.size;
        const fileSlice = this.slice.bind(this);
        let offset = 0;
        return new ReadableStream<Uint8Array<ArrayBuffer>>({
          async pull(controller) {
            if (offset >= fileSize) {
              controller.close();
              return;
            }
            const chunk = fileSlice(offset, offset + POLYFILL_CHUNK_SIZE);
            offset += POLYFILL_CHUNK_SIZE;
            const buffer = await readBlobAsArrayBuffer(chunk);
            controller.enqueue(
              new Uint8Array(buffer) as Uint8Array<ArrayBuffer>,
            );
          },
        });
      };
    }
  });
  it("should return a stream", async () => {
    const file = new File(["Hello World"], "hello.txt", { type: "text/plain" });
    const stream = await fileToStream(file);
    expect(stream).toBeDefined();
  });
  it("should return a stream with the correct content", async () => {
    const file = new File(["Hello World"], "hello.txt", { type: "text/plain" });
    const stream = await fileToStream(file);
    const reader = stream.getReader();
    const { done, value } = await reader.read();
    expect(done).toBe(false);
    expect(new TextDecoder().decode(value)).toBe("Hello World");
  });
});

const POLYFILL_CHUNK_SIZE = 1024 * 1024 * 10;

const readBlobAsArrayBuffer = (blob: Blob): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // FileReader.result can be ArrayBufferLike, but readAsArrayBuffer specifically returns ArrayBuffer
      const { result } = reader;
      if (result instanceof ArrayBuffer) {
        resolve(result);
      } else {
        reject(new Error("Expected ArrayBuffer from FileReader"));
      }
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Unable to read blob chunk."));
    reader.readAsArrayBuffer(blob);
  });
