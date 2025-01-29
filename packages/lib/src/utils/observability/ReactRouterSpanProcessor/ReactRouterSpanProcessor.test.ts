import { Span } from "@opentelemetry/sdk-trace-base";
import ReactRouterSpanProcessor from ".";
import { RouteConfig } from "./types";

describe("ReactRouterSpanProcessor (without mocking calculateRouteName)", () => {
  let spanProcessor: ReactRouterSpanProcessor;
  const mockRouteConfig: RouteConfig = {
    upload: "/upload",
    spawnHost: "/spawn/host",
    versionPage: "/version/:id/:tab?",
    taskHistory: "/task-history/:projectId/:taskId",
  };

  beforeEach(() => {
    spanProcessor = new ReactRouterSpanProcessor(mockRouteConfig);
  });

  describe("onStart", () => {
    it("should set attributes on the span for a fully matched route", () => {
      const mockSpan = {
        setAttribute: vi.fn(),
      } as unknown as Span;

      Object.defineProperty(window, "location", {
        value: { pathname: "/upload" },
        writable: true,
      });

      spanProcessor.onStart(mockSpan);

      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_name",
        "upload",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route",
        "/upload",
      );
    });
    it("should set attributes for long dynamic routes", () => {
      const mockSpan = {
        setAttribute: vi.fn(),
      } as unknown as Span;

      Object.defineProperty(window, "location", {
        value: { pathname: "/task-history/evg/test-cloud" },
        writable: true,
      });

      spanProcessor.onStart(mockSpan);

      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_name",
        "taskHistory",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route",
        "/task-history/:projectId/:taskId",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_param.projectId",
        "evg",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_param.taskId",
        "test-cloud",
      );
    });
    it("should set attributes for matched dynamic routes with optional params", () => {
      const mockSpan = {
        setAttribute: vi.fn(),
      } as unknown as Span;

      Object.defineProperty(window, "location", {
        value: { pathname: "/version/123" },
        writable: true,
      });

      spanProcessor.onStart(mockSpan);

      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_name",
        "versionPage",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route",
        "/version/:id/:tab?",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_param.id",
        "123",
      );
    });

    it("should set attributes for the longest matching dynamic route", () => {
      const mockSpan = {
        setAttribute: vi.fn(),
      } as unknown as Span;

      Object.defineProperty(window, "location", {
        value: { pathname: "/version/123/tasks" },
        writable: true,
      });

      spanProcessor.onStart(mockSpan);

      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_name",
        "versionPage",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route",
        "/version/:id/:tab?",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_param.id",
        "123",
      );
      expect(mockSpan.setAttribute).toHaveBeenCalledWith(
        "page.route_param.tab?",
        "tasks",
      );
    });
    it("should not set attributes for unmatched routes", () => {
      const mockSpan = {
        setAttribute: vi.fn(),
      } as unknown as Span;

      Object.defineProperty(window, "location", {
        value: { pathname: "/unknown" },
        writable: true,
      });

      spanProcessor.onStart(mockSpan);

      expect(mockSpan.setAttribute).not.toHaveBeenCalled();
    });

    it("should not set attributes for partially matched static routes", () => {
      const mockSpan = {
        setAttribute: vi.fn(),
      } as unknown as Span;

      Object.defineProperty(window, "location", {
        value: { pathname: "/upload/extra" },
        writable: true,
      });

      spanProcessor.onStart(mockSpan);

      expect(mockSpan.setAttribute).not.toHaveBeenCalled();
    });
  });
});
