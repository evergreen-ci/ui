# Analytics Module

Type-safe event tracking for user interactions. Built on the [Observability Package](../utils/observability/README.md).

> **Note:** The observability package handles infrastructure telemetry (page loads, API calls). Use analytics for **business-specific user actions** (button clicks, feature usage).

> **Analytics Events Catalog:** All tracked analytics events are documented in the [Evergreen Analytics Spreadsheet](http://go/evergreen-analytics).

## Quick Start

### 1. Create an analytics hook

```typescript
// apps/spruce/src/analytics/task/useTaskAnalytics.ts
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";

type Action =
  | { name: "Clicked restart button" }
  | { name: "Changed task priority"; "task.priority": number }
  | { name: "Filtered tests table"; "filter.by": string };

export const useTaskAnalytics = () => {
  const { taskId } = useParams();

  return useAnalyticsRoot<Action, string>("Task", {
    "task.id": taskId,
  });
};
```

### 2. Use in your component

```typescript
import { useTaskAnalytics } from "analytics/task/useTaskAnalytics";

const TaskPage = () => {
  const { sendEvent } = useTaskAnalytics();

  const handleRestart = () => {
    sendEvent({ name: "Clicked restart button" });
    // ... restart logic
  };

  return <Button onClick={handleRestart}>Restart</Button>;
};
```

## Action Type Requirements

Event names must start with one of these prefixes:

- `Clicked` - Button/link clicks
- `Changed` - Value/state changes
- `Filtered` - Filtering operations
- `Sorted` - Sorting operations
- `Toggled` - Toggle actions
- `Viewed` - Page/modal views
- `Created` - Resource creation
- `Deleted` - Resource deletion
- `Saved` - Save operations
- `Used` - Feature usage

## What Gets Tracked

Each analytics event automatically includes:

**From your action:**
- Event name and custom properties
- Analytics identifier (e.g., "Task")
- Default properties from `useAnalyticsRoot()`

**From observability (automatic):**
- User ID, environment, app version
- Current route and route parameters
- Trace ID and span ID

## API Reference

### `useAnalyticsRoot<Action, Identifier>(identifier, attributes?)`

Creates an analytics hook for a feature/page.

**Parameters:**
- `identifier` - Feature name (e.g., "Task", "Navbar")
- `attributes` - Optional default properties for all events

**Returns:**
- `{ sendEvent }` - Function to send analytics events

### `sendEvent(action)`

Sends an analytics event.

**Example:**
```typescript
sendEvent({
  name: "Filtered tests table",
  "filter.by": "failed"
});
```

## Best Practices

### 1. One hook per feature/page
```
analytics/
  ├── task/useTaskAnalytics.ts
  ├── navbar/useNavbarAnalytics.ts
  └── preferences/usePreferencesAnalytics.ts
```

### 2. Type your actions
```typescript
type Action =
  | { name: "Clicked save button" }
  | { name: "Changed priority"; priority: number };
```

### 3. Use descriptive names
- ✅ "Clicked restart task button"
- ❌ "Button clicked"

### 4. Add relevant context
```typescript
sendEvent({
  name: "Filtered tests table",
  "filter.by": "failed",
  "test.count": 42
});
```

### 5. Never sample analytics events
Unlike infrastructure traces, analytics events are:
- Low volume (you choose what to track)
- High value (direct user actions)
- Essential for product insights

If you have too many analytics events, track fewer types - don't sample.

## Troubleshooting

### Events not appearing
1. Verify [observability package](../utils/observability/README.md) is initialized
2. Check `window.AttributeStore` exists
3. Look for errors in browser console
4. Search Honeycomb for `analytics.identifier` attribute

### TypeScript errors
- Ensure action names start with required prefixes
- Verify all action properties are in your `Action` type

## Examples

### Simple hook
```typescript
type Action =
  | { name: "Clicked logo" }
  | { name: "Clicked settings" };

export const useNavbarAnalytics = () =>
  useAnalyticsRoot<Action, string>("Navbar");
```

### Hook with context
```typescript
type Action =
  | { name: "Clicked restart" }
  | { name: "Changed priority"; priority: number };

export const useTaskAnalytics = () => {
  const { taskId } = useParams();
  const { data } = useQuery(TASK_QUERY);

  return useAnalyticsRoot<Action, string>("Task", {
    "task.id": taskId,
    "task.status": data?.task?.status,
  });
};
```

### Usage in component
```typescript
const TaskActions = () => {
  const { sendEvent } = useTaskAnalytics();

  return (
    <>
      <Button onClick={() => sendEvent({ name: "Clicked restart" })}>
        Restart
      </Button>
      <Select onChange={(priority) =>
        sendEvent({ name: "Changed priority", priority })
      } />
    </>
  );
};
```

## Related Documentation

- [Observability Package](../utils/observability/README.md) - Infrastructure telemetry
- [Honeycomb](https://docs.honeycomb.io/) - Query and analyze your events
