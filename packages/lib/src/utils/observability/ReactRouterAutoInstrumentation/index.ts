import { context, trace } from "@opentelemetry/api";
import {
  InstrumentationBase,
  InstrumentationConfig,
} from "@opentelemetry/instrumentation";
import { RouteConfig } from "../types";
import { calculateRouteName } from "./utils";

export interface ReactRouterAutoInstrumentationConfig
  extends InstrumentationConfig {
  routeConfig: RouteConfig;
}

export class ReactRouterAutoInstrumentation extends InstrumentationBase {
  constructor(config: ReactRouterAutoInstrumentationConfig) {
    super("@opentelemetry/instrumentation-react-router", "1.0.0", config);
  }

  // eslint-disable-next-line class-methods-use-this
  protected init() {
    // Return empty patch list as an example; in real usage you might patch
    // React Router's lifecycle or listen for location changes.
    return [];
  }

  /**
   * Enable the instrumentation. Here, we simply attempt to get the current
   * active span and set attributes based on matching the route configuration.
   */
  override enable() {
    super.enable();

    const currentSpan = trace.getSpan(context.active());
    if (!currentSpan) {
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    const { routeConfig } = this
      ._config as ReactRouterAutoInstrumentationConfig;
    const matchedRoute = calculateRouteName(
      window.location.pathname,
      routeConfig,
    );
    if (matchedRoute) {
      currentSpan.setAttribute("url.path_name", matchedRoute.name);
      currentSpan.setAttribute("url.path_base", matchedRoute.path);
    }
  }

  /**
   * Disable the instrumentation.
   */
  override disable() {
    super.disable();
  }
}
