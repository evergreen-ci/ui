import httpProxy from "http-proxy";
import handler from "serve-handler";
import http from "http";
import path from "path";

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((request, response) => {
  if (request.method === "POST") {
    console.log(`Proxying POST request... ${request.url}`);
    return proxy.web(request, response, { target: "http://localhost:9090" });
  }
  return handler(request, response, {
    public: path.resolve(import.meta.dirname, "../dist"),
    rewrites: [
      {
        source: "**",
        destination: "./index.html",
      },
    ],
  });
});

server.listen(3000, () => {
  console.log("Running at http://localhost:3000");
});
