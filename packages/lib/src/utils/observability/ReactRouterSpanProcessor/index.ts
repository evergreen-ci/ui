import { Context } from "@opentelemetry/api";
import type { Span } from "@opentelemetry/sdk-trace-base";
import { RouteConfig } from "./types";
import { calculateRouteName, getRouteParams } from "./utils";

class ReactRouterSpanProcessor {
  private routeConfig: RouteConfig;

  constructor(routeConfig: RouteConfig) {
    this.routeConfig = routeConfig;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(span: Span, _parentContext: Context): void {
    const matchedRoute = calculateRouteName(
      window.location.pathname,
      this.routeConfig,
    );
    if (matchedRoute) {
      // Type assertion needed due to type mismatch between SpanProcessor interface
      // and actual Span implementation from Honeycomb SDK
      const spanWithAttributes = span as Span & {
        setAttribute: (key: string, value: unknown) => void;
      };
      spanWithAttributes.setAttribute("page.route_name", matchedRoute.name);
      spanWithAttributes.setAttribute("page.route", matchedRoute.route);
      const params = getRouteParams(
        matchedRoute.route,
        window.location.pathname,
      );
      Object.entries(params).forEach(([key, value]) => {
        spanWithAttributes.setAttribute(`page.route_param.${key}`, value);
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
