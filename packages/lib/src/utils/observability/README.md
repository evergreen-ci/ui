# Observability Package

OpenTelemetry-based observability using [Honeycomb's Web SDK](https://docs.honeycomb.io/get-started/start-building/application/web/) for distributed tracing, performance monitoring, and analytics.

## Quick Start

### 1. Initialize Honeycomb in your app entry point

```typescript
// apps/spruce/src/index.tsx
import {
  initializeHoneycomb,
  injectOpenTelemetryAttributeStoreIntoWindow,
} from "@evg-ui/lib/utils/observability";

// Define your routes for automatic route tracking
const routeConfig = {
  ...routes,
  task: "/task/:taskId/:execution?",
  preferences: `${routes.preferences}/:tab?`,
};

initializeHoneycomb({
  serviceName: "spruce",
  endpoint: process.env.REACT_APP_HONEYCOMB_ENDPOINT || "",
  ingestKey: process.env.REACT_APP_HONEYCOMB_INGEST_KEY || "",
  backendURL: toEscapedRegex(getEvergreenUrl()),
  environment: getReleaseStage(),
  appVersion: getAppVersion(),
  debug: isDevelopmentBuild(),
  routeConfig,
});

injectOpenTelemetryAttributeStoreIntoWindow();

createRoot(document.getElementById("root")).render(<App />);
```

### 2. Set global attributes in your root component

```typescript
// Use the app-specific hook to set user ID and other global attributes
const Layout = () => {
  const { data } = useQuery<UserQuery>(USER);
  useAnalyticsAttributes(data?.user?.userId ?? "");
  return <Outlet />;
};
```

## What You Get

**Auto-instrumentation:**
- Page loads and navigation
- HTTP fetch requests (with GraphQL operation detection)
- React Router routes and parameters

**Global attributes:**
- User ID, environment, app version
- Route information on every span
- Custom attributes via `AttributeStore`

**Analytics integration:**
- User interaction events via the [Analytics Module](../../analytics/README.md)
- All analytics events automatically include route and user context

## Core Components

### `initializeHoneycomb(config)`

Sets up the Honeycomb SDK with auto-instrumentation.

**Required config:**
- `serviceName` - Your app name (e.g., "spruce", "parsley")
- `endpoint` - Honeycomb collector endpoint
- `ingestKey` - Honeycomb API key
- `routeConfig` - Route definitions for automatic tracking
- `environment` - Deployment environment
- `appVersion` - App version string

**Optional config:**
- `backendURL` - Enable trace propagation to backend
- `debug` - Enable debug mode with local visualizations

### `injectOpenTelemetryAttributeStoreIntoWindow()`

Creates `window.AttributeStore` for managing global span attributes.

**Methods:**
```typescript
window.AttributeStore.setGlobalAttribute(key, value)
window.AttributeStore.removeGlobalAttribute(key)
window.AttributeStore.getGlobalAttributes()
```

### `ReactRouterSpanProcessor`

Automatically adds route information to all spans:
- `page.route_name` - Named route (e.g., "task")
- `page.route` - Route pattern (e.g., "/task/:taskId")
- `page.route_param.*` - Route parameters

### GraphQL Detection

Automatically detects and labels GraphQL operations in fetch requests:
- `graphql.operation_name` - Operation name
- `graphql.query_type` - "query" or "mutation"

## Managing Trace Volume

Web instrumentation generates high telemetry volume. If needed:

1. **Disable noisy instrumentations** (recommended first):
   ```typescript
   instrumentations: [
     getWebAutoInstrumentations({
       "@opentelemetry/instrumentation-document-load": {},
       "@opentelemetry/instrumentation-fetch": {},
       "@opentelemetry/instrumentation-user-interaction": false, // Disable if too noisy
     }),
   ],
   ```

2. **Implement sampling** (if necessary):
   - Sample infrastructure events (page loads, routine fetches)
   - **Never sample analytics events** - they represent direct user actions
   - Always preserve error traces

## Troubleshooting

### Traces not appearing
- Check Honeycomb INGEST key and endpoint are set
- Verify `initializeHoneycomb()` was called before React renders
- Enable debug mode: `debug: true` to see trace links in console

### AttributeStore not found
- Ensure `injectOpenTelemetryAttributeStoreIntoWindow()` is called after `initializeHoneycomb()`

### Routes not tracked
- Verify route config includes all application routes
- Check optional parameters are marked with `?`

## Related Documentation

- [Analytics Module](../../analytics/README.md) - High-level user event tracking
- [Honeycomb Web Guide](https://docs.honeycomb.io/get-started/start-building/application/web/) - Official Honeycomb documentation
- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/instrumentation/js/) - OTEL documentation
