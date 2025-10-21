# Analytics Module

This module provides a type-safe, OpenTelemetry-based analytics system for tracking user interactions and events across the application.

> **Related Documentation:** This analytics module is built on top of the [Observability Package](../utils/observability/README.md), which provides the underlying OpenTelemetry infrastructure, Honeycomb integration, and global attribute management.

## Overview

The analytics module enables event tracking by:
- Creating OpenTelemetry traces for each event
- Enriching events with global attributes from `AttributeStore`
- Providing type-safe action definitions with strict naming conventions
- Offering a React hook-based API for easy integration

**Key Distinction:** The analytics module focuses on **user interaction tracking** (clicks, form submissions, feature usage), while the [observability package](../utils/observability/README.md) handles **infrastructure-level telemetry** (page loads, HTTP requests, performance metrics).

## Architecture

### How It Works

The analytics module sits on top of the [observability infrastructure](../utils/observability/README.md):

1. **AttributeStore** - A global store (injected into `window.AttributeStore` by the [observability package](../utils/observability/README.md#attributestore---global-attribute-management)) that maintains shared attributes for all events (e.g., user info, session data)
2. **OpenTelemetry Traces** - Each event is sent as an OTEL span with attributes using the tracer initialized by [Honeycomb SDK](../utils/observability/README.md#honeycombts---sdk-initialization)
3. **Action Types** - Strictly typed event names with predefined prefixes
4. **Analytics Hooks** - Custom hooks per feature/page that provide a `sendEvent` function

```
Component -> useAnalyticsHook() -> useAnalyticsRoot() -> sendEventTrace() -> OTEL Span
                                                              ↓
                                                      AttributeStore (global attributes)
                                                              ↓
                                                      Observability Infrastructure
                                                              ↓
                                                          Honeycomb
```

> **Infrastructure Setup:** Before using analytics, ensure the [observability package is initialized](../utils/observability/README.md#initialization-guide) in your app's entry point.

## Core Components

### `types.ts`

Defines the core types for the analytics system:

- **`ActionType`** - Interface for event actions with enforced naming convention:
  ```typescript
  interface ActionType {
    name: `${ActionTypePrefixes}${string}`;
  }
  ```

- **`ActionTypePrefixes`** - Allowed event name prefixes:
  - `Changed` - For state/value changes
  - `Clicked` - For button/link clicks
  - `Created` - For resource creation
  - `Deleted` - For resource deletion
  - `Redirected` - For navigation events
  - `Filtered` - For filtering operations
  - `Saved` - For save operations
  - `Sorted` - For sorting operations
  - `Toggled` - For toggle/switch actions
  - `Viewed` - For page/component views
  - `Used` - For feature usage
  - `System Event` - For system-generated events

- **`AnalyticsProperties`** - Additional metadata to attach to events:
  ```typescript
  interface AnalyticsProperties {
    [key: string]: AttributeValue; // OpenTelemetry AttributeValue
  }
  ```

- **`Analytics<Action>`** - The return type of analytics hooks:
  ```typescript
  interface Analytics<Action extends ActionType> {
    sendEvent: (action: Action) => void;
  }
  ```

### `utils.ts`

Contains the core event sending logic:

- **`sendEventTrace(action, properties)`** - Sends an event as an OTEL trace
  - Retrieves global attributes from `window.AttributeStore`
  - Creates an OTEL span with the action name
  - Attaches global attributes, custom properties, and action properties to the span

### `hooks.ts`

Provides the main React hook for creating analytics instances:

- **`useAnalyticsRoot<Action, Identifier>(analyticsIdentifier, attributes?)`**
  - `analyticsIdentifier` - A string identifying the feature/page (e.g., "Task", "Navbar")
  - `attributes` - Optional default properties to include with every event
  - Returns an `Analytics<Action>` object with a `sendEvent` function

## Usage Guide

### Step 1: Create a Feature-Specific Analytics Hook

Create a new file in your app's `analytics/` directory:

```typescript
// apps/spruce/src/analytics/navbar/useNavbarAnalytics.ts
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | { name: "Clicked logo link" }
  | { name: "Clicked my patches link" }
  | { name: "Clicked profile link" };

export const useNavbarAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("Navbar");
```

### Step 2: Use the Hook in Your Component

```typescript
import { useNavbarAnalytics } from "analytics/navbar/useNavbarAnalytics";

const MyComponent = () => {
  const { sendEvent } = useNavbarAnalytics();

  const handleLogoClick = () => {
    sendEvent({ name: "Clicked logo link" });
    // ... other logic
  };

  return <Logo onClick={handleLogoClick} />;
};
```

### Step 3: Add Properties to Events (Optional)

Actions can include additional properties:

```typescript
type Action =
  | { name: "Clicked suggestion"; suggestion: string }
  | { name: "Changed task priority"; "task.priority": number };

// Usage:
sendEvent({ name: "Clicked suggestion", suggestion: "Run tests" });
sendEvent({ name: "Changed task priority", "task.priority": 5 });
```

### Step 4: Add Default Properties (Optional)

Pass default properties that will be included with every event:

```typescript
export const useTaskAnalytics = () => {
  const taskId = useParams().taskId;
  const { data } = useQuery(TASK_QUERY);

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Task", {
    "task.id": taskId,
    "task.status": data?.task?.status,
    "task.execution": 0,
  });
};
```

## Examples from the Codebase

### Simple Analytics Hook

```typescript
// apps/spruce/src/analytics/navbar/useNavbarAnalytics.ts
type Action =
  | { name: "Clicked admin settings link" }
  | { name: "Clicked legacy UI link" }
  | { name: "Clicked logo link" };

export const useNavbarAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("Navbar");
```

### Advanced Analytics Hook with Context

```typescript
// apps/spruce/src/analytics/task/useTaskAnalytics.ts
type Action =
  | { name: "Filtered tests table"; "filter.by": string | string[] }
  | { name: "Sorted tests table"; "sort.by": TestSortCategory | TestSortCategory[] }
  | { name: "Clicked restart task button"; "task.is_display_task": false }
  | { name: "Changed task priority"; "task.priority": number };

export const useTaskAnalytics = () => {
  const { taskId } = useParams();
  const { data } = useQuery<TaskQuery>(TASK);

  const { displayName, displayStatus, status } = data?.task || {};

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Task", {
    "task.id": taskId || "",
    "task.name": displayName || "",
    "task.display_status": displayStatus || "",
    "task.status": status || "",
  });
};
```

### Usage in Component

```typescript
// apps/parsley/src/components/Chatbot/index.tsx
const Chatbot = () => {
  const { sendEvent } = useAIAgentAnalytics();

  return (
    <Chat
      onClickSuggestion={(suggestion) => {
        sendEvent({ name: "Clicked suggestion", suggestion });
      }}
    />
  );
};
```

## Action Type Naming Conventions

Follow these conventions when defining action names:

1. **Start with a prefix** - Use one of the predefined `ActionTypePrefixes`
2. **Be specific and descriptive** - "Clicked save button" not "Button click"
3. **Use past tense for prefixes** - "Clicked", "Changed", "Created" (not "Click", "Change")
4. **Include context** - "Clicked task restart button" not just "Clicked button"

### Good Examples
- `"Clicked logo link"`
- `"Changed task priority"`
- `"Filtered tests table"`
- `"Viewed notification modal"`

### Bad Examples
- ❌ `"Click button"` - Should be past tense: "Clicked"
- ❌ `"Button"` - Missing prefix and context
- ❌ `"User clicked on the save button"` - Too verbose, no proper prefix

## Property Naming Conventions

When adding properties to events:

1. **Use dot notation for hierarchies** - `"task.id"`, `"filter.by"`
2. **Use snake_case** - `"task.is_display_task"`, `"failed_test_count"`
3. **Be consistent** - Use the same property names across similar events
4. **Avoid redundancy** - Don't prefix with identifier (e.g., use `"status"` not `"task.status"` if the identifier is already "Task")

## Best Practices

### 1. Create One Hook Per Feature/Page

Organize analytics hooks by feature or page to keep events grouped logically:

```
apps/spruce/src/analytics/
  ├── task/
  │   ├── useTaskAnalytics.ts
  │   ├── useTaskHistoryAnalytics.ts
  │   └── useAnnotationAnalytics.ts
  ├── navbar/
  │   └── useNavbarAnalytics.ts
  └── preferences/
      └── usePreferencesAnalytics.ts
```

### 2. Type Your Actions

Define a union type for all possible actions to get autocomplete and type checking:

```typescript
type Action =
  | { name: "Clicked save button" }
  | { name: "Changed input"; "input.value": string }
  | { name: "Toggled feature"; "feature.enabled": boolean };
```

### 3. Include Relevant Context

Add properties that provide context for the event:

```typescript
sendEvent({
  name: "Clicked log link",
  "log.type": "agent",
  "log.viewer": "parsley"
});
```

### 4. Use Default Properties for Shared Context

If multiple events need the same properties, pass them as default attributes:

```typescript
useAnalyticsRoot<Action, AnalyticsIdentifier>("Task", {
  "task.id": taskId,
  "task.status": taskStatus,
});
```

### 5. Keep Event Names User-Centric

Focus on user actions, not implementation details:
- ✅ "Clicked filter button"
- ❌ "Set state variable to true"

### 6. Analytics vs Observability

Understand when to use analytics vs relying on observability auto-instrumentation:

**Use Analytics (this module) for:**
- User-initiated actions (clicks, form submissions)
- Business events (feature adoption, workflow completion)
- A/B test tracking
- Product analytics

**Auto-instrumented by [Observability Package](../utils/observability/README.md) (don't duplicate):**
- Page loads and navigation
- HTTP requests (including GraphQL)
- Basic user interactions (clicks, scrolls)
- Performance metrics

### 7. Don't Over-Track

Track meaningful user interactions, not every render or mouse movement:
- ✅ Form submissions, button clicks, page views
- ❌ Every input keystroke, every hover event

> **Note:** The [observability package](../utils/observability/README.md) automatically tracks page loads, HTTP requests, and basic user interactions. Use analytics for **business-specific events** that provide product insights.

## Integration with OpenTelemetry

Events are sent as OpenTelemetry spans using the infrastructure provided by the [observability package](../utils/observability/README.md), which means they:
- Appear in your observability platform (Honeycomb)
- Include all attributes from `AttributeStore.getGlobalAttributes()` (see [AttributeStore docs](../utils/observability/README.md#attributestore---global-attribute-management))
- Include route information added by [ReactRouterSpanProcessor](../utils/observability/README.md#reactrouterspanprocessor---route-tracking)
- Can be queried and analyzed alongside other telemetry data (page loads, API calls, etc.)
- Support distributed tracing if configured (see [trace propagation](../utils/observability/README.md#9-use-trace-propagation))

### Full Event Context

Each analytics event automatically includes:

**From Analytics Module:**
- Event name (e.g., "Clicked save button")
- Action-specific properties (e.g., `"button.type": "primary"`)
- Analytics identifier (e.g., `"analytics.identifier": "Task"`)
- Default properties from `useAnalyticsRoot()`

**From Observability Package:**
- Global attributes from `AttributeStore` (user ID, environment, etc.)
- Route information (`page.route_name`, `page.route_param.*`)
- Resource attributes (app version, service name)
- Standard OTEL span metadata (trace ID, span ID, timestamp)

This rich context enables powerful querying in Honeycomb. For example:
```
// Find all "Clicked" events on the task page by a specific user
WHERE name STARTS_WITH "Clicked"
  AND page.route_name = "task"
  AND user.id = "63a8f9e1b2d4c5"
  AND analytics.identifier = "Task"
```

> **Deep Dive:** For more details on how the observability infrastructure works, see the [Observability Package README](../utils/observability/README.md).

## Troubleshooting

### Events Not Appearing

1. **Check Observability Setup** - Ensure [Honeycomb is initialized](../utils/observability/README.md#initialization-guide) before your React app renders
2. **Check AttributeStore** - Verify `window.AttributeStore` exists (should be injected by [observability package](../utils/observability/README.md#step-4-inject-attributestore))
3. **Check Console** - Look for errors from `sendEventTrace` in browser console
4. **Check Honeycomb** - Verify traces are appearing in Honeycomb (filter by `name` attribute or `analytics.identifier`)

> **Note:** Analytics events won't be sent if the observability infrastructure isn't initialized. See the [Observability Package Troubleshooting Guide](../utils/observability/README.md#troubleshooting) for infrastructure-level issues.

### TypeScript Errors

1. Ensure action names match the `ActionTypePrefixes` pattern
2. Verify all action properties are defined in your `Action` type
3. Check that `AnalyticsIdentifier` is imported from the correct location

### Missing Properties

1. **Global Attributes** - Remember that attributes from `AttributeStore` are automatically included (see [AttributeStore usage](../utils/observability/README.md#attributestore---global-attribute-management))
2. **Route Attributes** - Route information is added automatically by the observability package (see [route tracking](../utils/observability/README.md#route-tracking))
3. **Default Attributes** - Check that default attributes passed to `useAnalyticsRoot` are valid
4. **Action Properties** - Verify that action-specific properties are included in the action object
