import { useEffect, useRef } from "react";
import { Span, trace } from "@opentelemetry/api";
import { WaterfallQuery } from "gql/generated/types";
import { getGQLUrl } from "utils/environmentVariables";

const tracer = trace.getTracer("performance");

type NavigationDirection = "next" | "previous";

interface ActiveNavigation {
  span: Span;
  startTime: number;
}

let activeNavigation: ActiveNavigation | null = null;

const getProjectClass = (projectIdentifier: string) => {
  if (projectIdentifier.startsWith("mongodb-mongo-")) {
    return "mongodb-mongo";
  }
  if (projectIdentifier === "mms" || projectIdentifier.startsWith("mms-")) {
    return "mms";
  }
  return "other";
};

export const startWaterfallNavigationTrace = ({
  direction,
  projectIdentifier,
}: {
  direction: NavigationDirection;
  projectIdentifier: string;
}) => {
  if (activeNavigation) {
    activeNavigation.span.setAttribute("waterfall.navigation.cancelled", true);
    activeNavigation.span.end();
  }

  const span = tracer.startSpan("Navigate waterfall");
  span.setAttributes({
    "waterfall.navigation.direction": direction,
    "waterfall.project_class": getProjectClass(projectIdentifier),
    "waterfall.project_identifier": projectIdentifier,
  });
  activeNavigation = { span, startTime: performance.now() };
};

export const finishWaterfallNavigationTrace = ({
  buildCount,
  taskCount,
  versionCount,
}: {
  buildCount: number;
  taskCount: number;
  versionCount: number;
}) => {
  const navigation = activeNavigation;
  if (!navigation) {
    return;
  }

  requestAnimationFrame(() => {
    setTimeout(() => {
      if (activeNavigation !== navigation) {
        return;
      }

      const gqlURL = new URL(getGQLUrl(), window.location.origin).href;
      const networkRequestOccurred = performance
        .getEntriesByType("resource")
        .some(
          (entry) =>
            entry.startTime >= navigation.startTime &&
            entry.name.startsWith(gqlURL),
        );

      navigation.span.setAttributes({
        "waterfall.build.count": buildCount,
        "waterfall.navigation.network_request": networkRequestOccurred,
        "waterfall.task.count": taskCount,
        "waterfall.version.count": versionCount,
      });
      navigation.span.end();
      activeNavigation = null;
    }, 0);
  });
};

export const useWaterfallTrace = () => {
  const resolveRenderRef = useRef<(() => void) | null>(null);
  const renderPromiseRef = useRef<Promise<void> | null>(null);
  const spanRef = useRef<Span | null>(null);

  useEffect(() => {
    // Initialize the promise and resolver only once
    if (renderPromiseRef.current == null) {
      renderPromiseRef.current = new Promise<void>((resolve) => {
        resolveRenderRef.current = resolve;
      });
    }

    // Start the span and set up the promise chain
    if (spanRef.current == null && renderPromiseRef.current) {
      spanRef.current = tracer.startSpan("Render waterfall");
      renderPromiseRef.current.then(() => {
        if (spanRef.current) {
          spanRef.current.end();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (resolveRenderRef.current) {
      resolveRenderRef.current();
    }
  }, []);
};

export const useWaterfallNavigationTrace = ({
  data,
}: {
  data: WaterfallQuery | undefined;
}) => {
  useEffect(() => {
    if (!data) {
      return;
    }

    const { buildCount, taskCount } = data.waterfall.versions.reduce(
      (counts, version) => {
        version.waterfallBuilds?.forEach((build) => {
          counts.buildCount += 1;
          counts.taskCount += build.tasks?.length ?? 0;
        });
        return counts;
      },
      { buildCount: 0, taskCount: 0 },
    );

    finishWaterfallNavigationTrace({
      buildCount,
      taskCount,
      versionCount: data.waterfall.versions.length,
    });
  }, [data]);
};
