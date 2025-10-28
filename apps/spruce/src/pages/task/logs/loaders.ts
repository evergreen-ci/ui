import { trace } from "@opentelemetry/api";
import { LoaderFunctionArgs, defer } from "react-router-dom";
import { constructEvergreenTaskLogURL } from "@evg-ui/lib/constants/logURLTemplates";
import { streamedFetch } from "@evg-ui/lib/utils/request/streamedFetch";
import { decodeStream } from "@evg-ui/lib/utils/streams";

export const rawLogLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  if (typeof params.taskId !== "string") {
    throw new Response("Task ID not specified", { status: 400 });
  }
  const execution = parseInt(searchParams.get("execution") as string, 10);
  if (execution === undefined) {
    throw new Response("Execution not specified", { status: 400 });
  }
  const origin = searchParams.get("origin");
  if (!origin) {
    throw new Response("Log origin type not specified", { status: 400 });
  }

  const url = constructEvergreenTaskLogURL(params.taskId, execution, origin, {
    text: true,
    priority: true,
  });

  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("fetchLogFile", {
    attributes: { url },
  });

  return defer({
    logLines: streamedFetch(url, {}, span).then((s) => decodeStream(s)),
  });
};
