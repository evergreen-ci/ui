# Observability Package

This package provides a comprehensive OpenTelemetry-based observability system integrated with Honeycomb for distributed tracing, performance monitoring, and analytics tracking across the application.

## Overview

The observability package enables:
- **Distributed Tracing** - Track requests across frontend and backend with trace correlation
- **Auto-Instrumentation** - Automatic monitoring of page loads, HTTP fetches, and user interactions
- **Route Tracking** - Capture React Router routes and parameters on all spans
- **GraphQL Monitoring** - Detect and label GraphQL operations in HTTP traces
- **Global Attributes** - Maintain shared context across all traces and spans
- **Analytics Integration** - Power the analytics system with OpenTelemetry traces

## Architecture

```
App Initialization
    ↓
initializeHoneycomb() ──────────────┐
    ↓                               ↓
HoneycombWebSDK                ReactRouterSpanProcessor
    ↓                               ↓
Auto-Instrumentations          Route Tracking
    ↓                               ↓
injectOpenTelemetryAttributeStoreIntoWindow()
    ↓
window.AttributeStore (global attributes)
    ↓
All Spans/Traces include:
  - Auto-instrumentation data (page load, fetch, etc.)
  - Route information (name, params)
  - Global attributes (user ID, environment, etc.)
  - Analytics events (via sendEventTrace)
```

### Component Relationships

1. **Honeycomb SDK** - Core OTEL provider that manages tracing infrastructure
2. **AttributeStore** - Global attribute storage used by analytics and custom instrumentation
3. **ReactRouterSpanProcessor** - Custom span processor that enriches spans with route data
4. **Auto-Instrumentations** - OTEL modules for document load, fetch, and user interaction tracking
5. **Analytics Module** - Consumes OTEL tracer API to send analytics events as spans

## Core Components

### `honeycomb.ts` - SDK Initialization

The main entry point for initializing the observability stack using the [HoneycombWebSDK](https://docs.honeycomb.io/get-started/start-building/application/web/#honeycomb-web-sdk).

**Key Functions:**
- `initializeHoneycomb(config: HoneycombConfig)` - Sets up Honeycomb SDK with auto-instrumentation

**Honeycomb Web SDK Features:**
This implementation leverages Honeycomb's web-specific SDK which provides:
- Pre-configured OpenTelemetry setup optimized for browser environments
- Automatic instrumentation for common web operations
- Built-in trace batching and export
- Debug visualizations for local development
- Browser-specific context and performance metrics

**Configuration Interface:**
```typescript
interface HoneycombConfig {
  serviceName: string;        // e.g., "spruce" or "parsley"
  endpoint: string;           // Honeycomb collector endpoint
  backendURL?: string;        // Backend URL for trace propagation
  debug: boolean;             // Enable debug mode with local visualizations
  ingestKey: string;          // Honeycomb API key
  environment: string;        // e.g., "production", "staging", "development"
  routeConfig: RouteConfig;   // React Router route definitions
  appVersion: string;         // App version for tracking releases
}
```

**Features:**
- **Auto-Instrumentation** - Document load, HTTP fetch, user interactions (via [OpenTelemetry auto-instrumentation](https://docs.honeycomb.io/get-started/start-building/application/web/#add-instrumentation))
- **GraphQL Detection** - Automatically extracts operation names from GraphQL requests
- **Trace Propagation** - Connects frontend and backend traces using CORS headers (see [Honeycomb's distributed tracing guide](https://docs.honeycomb.io/get-started/start-building/application/web/#linking-frontend-and-backend-traces))
- **Resource Attributes** - Adds user ID, environment, and app version to all traces
- **Custom Span Processor** - Integrates ReactRouterSpanProcessor for route tracking
- **Local Visualizations** - Debug mode enables [Honeycomb's local trace visualization](https://docs.honeycomb.io/get-started/start-building/application/web/#debug-mode) for development

### `AttributeStore/` - Global Attribute Management

A global store for span attributes that should be included in all traces.

**Files:**
- `index.ts` - `OpenTelemetryAttributeStore` class implementation
- `types.ts` - `AttributeStore` interface
- `utils.ts` - `injectOpenTelemetryAttributeStoreIntoWindow()` function

**Interface:**
```typescript
interface AttributeStore {
  setGlobalAttribute(key: string, value: AttributeValue): void;
  removeGlobalAttribute(key: string): void;
  getGlobalAttributes(): Record<string, AttributeValue>;
  getGlobalAttribute(key: string): AttributeValue | undefined;
}
```

**Implementation:**
- Uses a `Map<string, AttributeValue>` internally
- Injected into `window.AttributeStore` at app initialization
- Accessed by analytics system and custom instrumentation
- Persists for entire session

**Common Global Attributes:**
- `user.id` - Current user's ID
- `log.type` - Type of log being viewed (Parsley only)
- `rendering.type` - Rendering mode (Parsley only)
- `environment` - Deployment environment
- `app_version` - Application version

### `ReactRouterSpanProcessor/` - Route Tracking

Custom OTEL span processor that enriches all spans with React Router information.

**Files:**
- `index.ts` - `ReactRouterSpanProcessor` class
- `types.ts` - `RouteConfig` type
- `utils.ts` - Route matching and parameter extraction utilities
- `utils.test.ts` - Unit tests

**How It Works:**
1. Implements OTEL `SpanProcessor` interface
2. On span start, extracts current pathname from `window.location`
3. Matches pathname against provided route configuration
4. Adds route name, route pattern, and route parameters as span attributes

**Attributes Added:**
```typescript
span.setAttribute("page.route_name", "task");           // Named route
span.setAttribute("page.route", "/task/:taskId");       // Route pattern
span.setAttribute("page.route_param.taskId", "12345");  // Route parameters
```

**Route Matching:**
- Uses `react-router-dom`'s `matchPath()` for accurate matching
- Supports optional parameters (e.g., `:tab?`)
- Handles complex routes with multiple parameters
- Returns empty string for optional params not provided

### `utils.ts` - Utility Functions

**`detectGraphqlQuery(body: string)`** - Extracts GraphQL operation information from request bodies.

**Returns:**
```typescript
{
  operationName: string;           // e.g., "TaskQuery"
  queryType: "mutation" | "query"; // Detected from query string
}
```

**Usage:**
Automatically called by fetch instrumentation to add GraphQL-specific attributes to HTTP spans:
```typescript
span.setAttribute("graphql.operation_name", "TaskQuery");
span.setAttribute("graphql.query_type", "query");
```

## Initialization Guide

### Step 1: Import Functions

In your app's entry point (`main.tsx` or `index.tsx`):

```typescript
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";
```

### Step 2: Configure Routes

Define your route configuration for route tracking:

```typescript
import routes, { slugs } from "./constants/routes";

const routeConfig = {
  ...routes,
  // Override specific routes to include optional parameters
  taskLogs: `${routes.taskLogs}/:${slugs.execution}?`,
  preferences: `${routes.preferences}/:${slugs.tab}?`,
};
```

### Step 3: Initialize Honeycomb

Call `initializeHoneycomb()` before rendering your React app:

```typescript
initializeHoneycomb({
  serviceName: "spruce",
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  backendURL: toEscapedRegex(getEvergreenUrl() || ""),
  environment: getReleaseStage(),
  appVersion: getAppVersion(),
  debug: isDevelopmentBuild(),
  routeConfig,
});
```

### Step 4: Inject AttributeStore

Call `injectOpenTelemetryAttributeStoreIntoWindow()` after Honeycomb initialization:

```typescript
injectOpenTelemetryAttributeStoreIntoWindow();
```

### Step 5: Set Global Attributes

In your app's layout/root component, set global attributes:

```typescript
import { useAnalyticsAttributes } from "analytics";

const Layout = () => {
  const { data } = useQuery<UserQuery>(USER);
  useAnalyticsAttributes(data?.user?.userId ?? "");

  return <Outlet />;
};
```

### Complete Example

**Spruce** ([apps/spruce/src/index.tsx](../../../../../../apps/spruce/src/index.tsx)):
```typescript
import { initializeHoneycomb, injectOpenTelemetryAttributeStoreIntoWindow }
  from "@evg-ui/lib/utils/observability";

const routeConfig = {
  ...routes,
  projectSettings: `${routes.projectSettings}/:${slugs.tab}?`,
  preferences: `${routes.preferences}/:${slugs.tab}?`,
};

initializeHoneycomb({
  serviceName: "spruce",
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  backendURL: toEscapedRegex(getEvergreenUrl() || ""),
  environment: getReleaseStage(),
  appVersion: getAppVersion(),
  debug: isDevelopmentBuild(),
  routeConfig,
});

injectOpenTelemetryAttributeStoreIntoWindow();

createRoot(document.getElementById("root")).render(<App />);
```

**Parsley** ([apps/parsley/src/main.tsx](../../../../../../apps/parsley/src/main.tsx)):
```typescript
const routeConfig = {
  ...routes,
  testLogs: `${routes.testLogs}/:${slugs.groupID}?`,
};

initializeHoneycomb({
  serviceName: "parsley",
  appVersion: process.env.REACT_APP_VERSION || "",
  backendURL: toEscapedRegex(evergreenURL || ""),
  debug: isDevelopmentBuild(),
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  environment: getReleaseStage(),
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  routeConfig,
});

injectOpenTelemetryAttributeStoreIntoWindow();
```

## Configuration

### Environment Variables

Required environment variables for production:

- `REACT_APP_HONEYCOMB_ENDPOINT` - Honeycomb collector endpoint URL
- `REACT_APP_HONEYCOMB_INGEST_KEY` - Honeycomb API key for ingestion
- `REACT_APP_VERSION` - Application version string
- `REACT_APP_SPRUCE_SENTRY_DSN` / `REACT_APP_PARSLEY_SENTRY_DSN` - Sentry DSN for error tracking

### Debug Mode

When `debug: true` is set:
- SDK prints trace links to console for easy debugging
- Local visualizations are enabled in Honeycomb UI
- Missing credentials result in warnings instead of errors
- No traces are sent if credentials are missing

**When to use debug mode:**
- Local development
- Testing observability integration
- Debugging trace issues

**When NOT to use debug mode:**
- Production builds
- Staging environments
- Performance testing (adds overhead)

### Route Configuration Best Practices

1. **Include Optional Parameters** - Override routes with optional params to ensure proper tracking:
   ```typescript
   preferences: `${routes.preferences}/:${slugs.tab}?`
   ```

2. **Use Consistent Naming** - Route names should match your routing constants:
   ```typescript
   { task: "/task/:taskId" }  // ✅ Clear and consistent
   { taskPage: "/task/:taskId" }  // ❌ Inconsistent with routes.task
   ```

3. **Include All Routes** - Ensure all application routes are in the config:
   ```typescript
   const routeConfig = {
     ...routes,  // Base routes
     // Override specific routes with params
   };
   ```

## Auto-Instrumentation

The Honeycomb SDK automatically instruments the following:

### Document Load Instrumentation
- `@opentelemetry/instrumentation-document-load`
- Tracks page load performance metrics
- Network events are ignored to reduce noise

**Spans Created:**
- `documentLoad` - Full page load time
- `documentFetch` - Document fetch time
- `resourceFetch` - Individual resource loads

### Fetch Instrumentation
- `@opentelemetry/instrumentation-fetch`
- Monitors all `fetch()` API calls
- Supports trace propagation for backend correlation
- Includes custom GraphQL detection

**Configuration:**
```typescript
{
  applyCustomAttributesOnSpan: (span, request) => {
    // Detect and label GraphQL operations
    const graphqlQuery = detectGraphqlQuery(request.body);
    if (graphqlQuery) {
      span.setAttribute("graphql.operation_name", graphqlQuery.operationName);
      span.setAttribute("graphql.query_type", graphqlQuery.queryType);
    }
  },
  propagateTraceHeaderCorsUrls: [new RegExp(backendURL)],
}
```

**Attributes Added:**
- `http.method` - HTTP method (GET, POST, etc.)
- `http.url` - Full request URL
- `http.status_code` - Response status code
- `graphql.operation_name` - GraphQL operation name (if applicable)
- `graphql.query_type` - "query" or "mutation" (if applicable)

### User Interaction Instrumentation
- `@opentelemetry/instrumentation-user-interaction`
- Tracks clicks and user interactions
- Creates spans for event handlers

**Spans Created:**
- User click events
- Event handler execution time

## Integration with Analytics

The observability package provides the foundation for the analytics system located at `packages/lib/src/analytics/`.

### How They Work Together

1. **OTEL Tracer** - Analytics uses `trace.getTracer("analytics")` to create spans
2. **AttributeStore** - Analytics retrieves global attributes via `window.AttributeStore`
3. **Span Creation** - Each analytics event becomes an OTEL span sent to Honeycomb

### Analytics Event Flow

```typescript
// Component
const { sendEvent } = useAnalyticsRoot("Task", { "task.id": taskId });
sendEvent({ name: "Clicked restart button" });

// ↓ [packages/lib/src/analytics/hooks.ts]
sendEventTrace(action, { "analytics.identifier": "Task", "task.id": taskId });

// ↓ [packages/lib/src/analytics/utils.ts]
const globalAttributes = window.AttributeStore.getGlobalAttributes();
const tracer = trace.getTracer("analytics");
tracer.startActiveSpan("Clicked restart button", (span) => {
  span.setAttributes({
    ...globalAttributes,      // user.id, environment, etc.
    "analytics.identifier": "Task",
    "task.id": taskId,
  });
  span.end();
});

// ↓ Honeycomb receives span with:
{
  name: "Clicked restart button",
  attributes: {
    "user.id": "63a8f9e1b2d4c5",
    "environment": "production",
    "app_version": "6.1.3",
    "page.route_name": "task",
    "page.route": "/task/:taskId",
    "page.route_param.taskId": "12345",
    "analytics.identifier": "Task",
    "task.id": "12345",
  }
}
```

### Benefits of OTEL Integration

- **Unified Observability** - Analytics events, performance traces, and errors in one platform
- **Rich Context** - Every analytics event includes route, user, and environment data
- **Trace Correlation** - Connect user actions to backend operations
- **Standard Protocol** - Based on OpenTelemetry, vendor-agnostic
- **Powerful Querying** - Query analytics events alongside performance data in Honeycomb

## GraphQL Support

The observability package automatically detects and labels GraphQL operations in HTTP requests.

### How It Works

1. Fetch instrumentation intercepts all `fetch()` calls
2. `detectGraphqlQuery()` parses request body for GraphQL operations
3. If detected, adds `graphql.operation_name` and `graphql.query_type` attributes
4. Enables filtering and grouping by GraphQL operation in Honeycomb

### Detection Logic

```typescript
const detectGraphqlQuery = (body: string) => {
  const bodyJson = JSON.parse(body);
  if (bodyJson.operationName && bodyJson.query) {
    const queryType = bodyJson.query.startsWith("mutation")
      ? "mutation"
      : "query";
    return {
      operationName: bodyJson.operationName,
      queryType
    };
  }
  return undefined;
};
```

### Example GraphQL Span Attributes

```typescript
{
  "http.method": "POST",
  "http.url": "https://evergreen.mongodb.com/graphql/query",
  "http.status_code": 200,
  "graphql.operation_name": "TaskQuery",
  "graphql.query_type": "query",
  "page.route_name": "task",
  "user.id": "63a8f9e1b2d4c5"
}
```

### Querying GraphQL Operations

In Honeycomb, you can:
- Filter by operation: `WHERE graphql.operation_name = "TaskQuery"`
- Group by type: `GROUP BY graphql.query_type`
- Find slow operations: `WHERE duration_ms > 1000 AND graphql.operation_name EXISTS`
- Compare mutations vs queries: `BREAKDOWN BY graphql.query_type`

## Route Tracking

The `ReactRouterSpanProcessor` automatically enriches all spans with React Router information.

### How It Works

1. Implements OTEL `SpanProcessor` interface with `onStart()` hook
2. On every span creation, extracts `window.location.pathname`
3. Matches pathname against route configuration using `react-router-dom`'s `matchPath()`
4. Extracts route parameters from the URL
5. Adds route name, pattern, and parameters as span attributes

### Route Matching Algorithm

```typescript
// Given route config:
{ task: "/task/:taskId/:execution?" }

// And URL:
"/task/evergreen_123/5"

// Produces attributes:
{
  "page.route_name": "task",
  "page.route": "/task/:taskId/:execution?",
  "page.route_param.taskId": "evergreen_123",
  "page.route_param.execution": "5"
}
```

### Optional Parameters

Optional parameters (ending with `?`) are handled specially:
- If present in URL: Added with their value
- If missing from URL: Added with empty string `""`

```typescript
// Route: "/task/:taskId/:execution?"
// URL: "/task/evergreen_123"

// Attributes:
{
  "page.route_param.taskId": "evergreen_123",
  "page.route_param.execution": '""'  // Note: literal string ""
}
```

### Querying by Route

In Honeycomb, you can:
- Filter by route: `WHERE page.route_name = "task"`
- Group by route: `GROUP BY page.route_name`
- Filter by parameter: `WHERE page.route_param.taskId = "evergreen_123"`
- Find slow pages: `WHERE page.route_name EXISTS AND duration_ms > 2000`

## Best Practices

### 1. Initialize Before React Renders

Always call `initializeHoneycomb()` and `injectOpenTelemetryAttributeStoreIntoWindow()` **before** rendering your React app:

```typescript
// ✅ Correct order
initializeHoneycomb({ ... });
injectOpenTelemetryAttributeStoreIntoWindow();
createRoot(document.getElementById("root")).render(<App />);

// ❌ Wrong - React renders before observability is set up
createRoot(document.getElementById("root")).render(<App />);
initializeHoneycomb({ ... });
```

### 2. Set Global Attributes Early

Set user ID and other global attributes as early as possible in your component tree:

```typescript
// ✅ In root layout component
const Layout = () => {
  const { data } = useQuery<UserQuery>(USER);
  useAnalyticsAttributes(data?.user?.userId ?? "");
  return <Outlet />;
};
```

### 3. Use Consistent Attribute Names

Follow a consistent naming convention for attributes:
- Use dot notation: `user.id`, `task.status`, `page.route_name`
- Use snake_case: `failed_test_count`, `display_status`
- Prefix related attributes: `graphql.operation_name`, `graphql.query_type`

### 4. Don't Over-Instrument

The auto-instrumentation provides comprehensive coverage. Only add custom spans for:
- Complex business logic operations
- Long-running processes
- Critical user workflows

### 5. Use Debug Mode in Development

Enable debug mode during development to:
- Verify traces are being sent
- Debug trace structure and attributes
- Test trace propagation to backend

```typescript
initializeHoneycomb({
  debug: isDevelopmentBuild(),  // true for local dev
  // ...
});
```

### 6. Sanitize Sensitive Data

Never include sensitive data in span attributes:
- ❌ Passwords, tokens, API keys
- ❌ Credit card numbers, SSNs
- ❌ Personal health information
- ✅ User IDs (anonymized)
- ✅ Resource IDs, task IDs
- ✅ Feature flags, environment

### 7. Test Route Configuration

Ensure your route config covers all application routes by:
1. Checking that all routes from your router are included
2. Testing route matching in unit tests
3. Verifying route attributes appear in Honeycomb

### 8. Monitor Trace Volume

Be mindful of trace volume in production:
- Auto-instrumentation can generate significant data
- Consider sampling strategies for high-traffic applications
- Monitor Honeycomb usage to avoid unexpected costs

### 9. Use Trace Propagation

Enable trace propagation to connect frontend and backend traces:

```typescript
initializeHoneycomb({
  backendURL: toEscapedRegex(getEvergreenUrl()),  // Enable CORS propagation
  // ...
});
```

This allows you to:
- See full request lifecycle (frontend → backend → database)
- Debug latency issues across services
- Understand error propagation

### 10. Document Custom Attributes

If you add custom attributes via `AttributeStore`, document them:
- What they represent
- When they're set
- What values they can have
- Why they're needed

## Troubleshooting

### Traces Not Appearing in Honeycomb

**Check:**
1. Honeycomb INGEST key is set correctly
2. Endpoint URL is valid
3. Network allows connections to Honeycomb
4. Check browser console for SDK errors
5. Verify `initializeHoneycomb()` was called successfully

**Debug:**
```typescript
initializeHoneycomb({
  debug: true,  // Enable debug mode
  // ...
});
// Check console for trace links and errors
```

### AttributeStore Not Found Errors

**Error:** `AttributeStore not found on window object`

**Fix:** Ensure `injectOpenTelemetryAttributeStoreIntoWindow()` is called before any component tries to use it:

```typescript
// main.tsx
initializeHoneycomb({ ... });
injectOpenTelemetryAttributeStoreIntoWindow();  // Must be called!
createRoot(document.getElementById("root")).render(<App />);
```

### Route Attributes Missing

**Check:**
1. Route config includes all application routes
2. Route patterns match exactly (including optional params)
3. `ReactRouterSpanProcessor` is being used (automatically added by `initializeHoneycomb`)

**Debug:**
```typescript
import { calculateRouteName } from "@evg-ui/lib/utils/observability/ReactRouterSpanProcessor/utils";

// Test route matching
const result = calculateRouteName(window.location.pathname, routeConfig);
console.log("Matched route:", result);
```

### GraphQL Attributes Not Added

**Check:**
1. Request is actually a GraphQL request (has `operationName` and `query` in body)
2. Request body is JSON (not FormData or other format)
3. Fetch instrumentation is enabled (automatically enabled by auto-instrumentations)

### High Trace Volume

**Solutions:**
1. Implement sampling (reduce trace volume while maintaining visibility)
2. Disable user interaction instrumentation if not needed
3. Filter out noisy endpoints in fetch instrumentation
4. Review what's being instrumented and remove unnecessary spans

### Performance Impact

**If observability is affecting performance:**
1. Verify debug mode is disabled in production
2. Check trace volume - high volume impacts performance
3. Consider disabling user interaction instrumentation
4. Review custom spans - ensure they're not blocking operations

## Implementation Details

### Based on Honeycomb's Web Instrumentation

This package implements [Honeycomb's recommended approach for web applications](https://docs.honeycomb.io/get-started/start-building/application/web/), which includes:

1. **SDK Initialization** - Using `HoneycombWebSDK` instead of raw OpenTelemetry setup
2. **Auto-Instrumentation** - Leveraging `getWebAutoInstrumentations()` for common patterns
3. **Resource Attributes** - Adding service metadata at initialization
4. **Trace Propagation** - Configuring CORS for frontend-backend correlation
5. **Debug Mode** - Local visualizations for development

### Key Differences from Honeycomb's Basic Guide

While following Honeycomb's guide, this implementation adds:

- **ReactRouterSpanProcessor** - Custom span processor for React Router integration (not in Honeycomb's base guide)
- **AttributeStore** - Global attribute management system for dynamic context
- **GraphQL Detection** - Custom logic to parse and label GraphQL operations
- **Analytics Integration** - Unified system for user events and infrastructure telemetry
- **TypeScript** - Full type safety across all observability components

### Honeycomb-Specific Features Used

**Debug Mode with Local Visualizations:**
```typescript
initializeHoneycomb({
  debug: true,
  localVisualizations: true,  // Enables Honeycomb's debug UI
  // ...
});
```

When enabled, Honeycomb's SDK provides:
- Console links to view traces in Honeycomb
- Local trace visualization in the browser
- Detailed logging of trace export

**Trace Propagation for Backend Correlation:**
```typescript
propagateTraceHeaderCorsUrls: [new RegExp(backendURL)]
```

This enables [linking frontend and backend traces](https://docs.honeycomb.io/get-started/start-building/application/web/#linking-frontend-and-backend-traces) by propagating trace context headers.

## Dependencies

The observability package relies on these key dependencies (see [package.json](../../../../../package.json)):

- `@honeycombio/opentelemetry-web` (^1.0.1) - [Honeycomb's Web SDK](https://docs.honeycomb.io/get-started/start-building/application/web/#honeycomb-web-sdk)
- `@opentelemetry/api` (^1.9.0) - Core OTEL API
- `@opentelemetry/auto-instrumentations-web` (^0.40.0) - [Auto-instrumentation bundle](https://docs.honeycomb.io/get-started/start-building/application/web/#add-instrumentation)
- `@opentelemetry/instrumentation-user-interaction` (^0.41.0) - User interaction tracking
- `react-router-dom` (6.18.0) - For route matching in ReactRouterSpanProcessor

## Further Reading

### Honeycomb Documentation
- [Honeycomb Web Instrumentation Guide](https://docs.honeycomb.io/get-started/start-building/application/web/) - Official guide this package implements
- [Honeycomb Web SDK](https://github.com/honeycombio/honeycomb-opentelemetry-web) - SDK source code and examples
- [Linking Frontend and Backend Traces](https://docs.honeycomb.io/get-started/start-building/application/web/#linking-frontend-and-backend-traces)
- [Honeycomb Debug Mode](https://docs.honeycomb.io/get-started/start-building/application/web/#debug-mode)

### OpenTelemetry Documentation
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OTEL JavaScript SDK](https://github.com/open-telemetry/opentelemetry-js)
- [Web Auto-Instrumentation](https://opentelemetry.io/docs/instrumentation/js/automatic/)

### Related Internal Documentation
- [Analytics Module README](../../analytics/README.md) - High-level event tracking built on this infrastructure
