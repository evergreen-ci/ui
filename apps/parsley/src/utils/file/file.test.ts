import { fileToStream } from ".";

describe("fileToStream", () => {
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
