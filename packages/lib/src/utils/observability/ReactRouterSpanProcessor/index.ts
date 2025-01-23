/* eslint-disable class-methods-use-this */
import { SpanProcessor, Span } from "@opentelemetry/sdk-trace-base";
import { RouteConfig } from "./types";
import { calculateRouteName } from "./utils";

class ReactRouterSpanProcessor implements SpanProcessor {
  private routeConfig: RouteConfig;

  constructor(routeConfig: RouteConfig) {
    this.routeConfig = routeConfig;
  }

  onStart(span: Span): void {
    const matchedRoute = calculateRouteName(
      window.location.pathname,
      this.routeConfig,
    );
    if (matchedRoute) {
      span.setAttribute("router.route_name", matchedRoute.name);
      span.setAttribute("router.route", matchedRoute.route);
    }
  }

  onEnd(): void {}

  forceFlush() {
    return Promise.resolve();
  }

  shutdown() {
    return Promise.resolve();
  }
}

export default ReactRouterSpanProcessor;
