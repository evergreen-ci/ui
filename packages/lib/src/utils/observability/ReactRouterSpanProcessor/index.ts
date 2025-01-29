/* eslint-disable class-methods-use-this */
import { SpanProcessor, Span } from "@opentelemetry/sdk-trace-base";
import { RouteConfig } from "./types";
import { calculateRouteName, getRouteParams } from "./utils";

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
      span.setAttribute("page.route_name", matchedRoute.name);
      span.setAttribute("page.route", matchedRoute.route);
      const params = getRouteParams(
        matchedRoute.route,
        window.location.pathname,
      );
      Object.entries(params).forEach(([key, value]) => {
        span.setAttribute(`page.route_param.${key}`, value);
      });
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
