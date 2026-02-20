# Admin Settings

This guide explains how to add new fields and tabs to the admin settings page.

## Architecture Overview

The admin settings page has three top-level routes defined by the `AdminSettingsTabRoutes` enum in `constants/routes.ts`: **General**, **RestartTasks**, and **EventLog**. The General route contains nine writable sub-tabs defined by the `AdminSettingsGeneralSection` enum: Announcements, FeatureFlags, Runners, Web, Authentication, ExternalCommunications, BackgroundProcessing, Providers, and Other.

A single GraphQL query (`ADMIN_SETTINGS`) fetches all settings data and a single mutation (`SaveAdminSettings`) persists changes. When the user clicks save, the `AdminSaveButton` iterates over all changed sub-tabs, runs each tab's `formToGql` transformer to build mutation input fragments, merges them into one `AdminSettingsInput` object, and sends the mutation.

### Directory Structure

```
adminSettings/
├── index.tsx                       # Main page: fetches data, renders SideNav + tabs
├── Tabs.tsx                        # React Router routes for top-level tabs
├── Context.tsx                     # AdminSettingsProvider + useAdminSettingsContext
├── AdminSaveButton.tsx             # Merges changed tabs into one mutation payload
├── Header.tsx                      # Sticky header with title + save button
├── getTabTitle.ts                  # Tab route → display title mapping
└── tabs/
    ├── index.tsx                   # Barrel exports
    ├── types.ts                    # FormStateMap, WritableAdminSettingsType, etc.
    ├── transformers.ts             # Central registry mapping sections → gqlToForm/formToGql
    ├── BaseTab.tsx                 # Shared base connecting each sub-tab to context
    ├── testData.ts                 # Shared mock data for transformer tests
    ├── sharedStyles.ts             # Shared CSS constants
    ├── EventLogsTab/
    ├── RestartTasksTab/
    └── GeneralTab/
        ├── GeneralTab.tsx          # Renders all 9 sub-tabs
        └── WebTab/                 # Example sub-tab (each follows this pattern)
            ├── WebTab.tsx          # Tab component
            ├── getFormSchema.ts    # JSON Schema + UI Schema assembly
            ├── schemaFields.ts     # Field-level schema definitions
            ├── transformers.ts     # gqlToForm / formToGql
            ├── transformers.test.ts# Roundtrip tests
            └── types.ts           # FormState type
```

### Key Concepts

**Form library:** [React JSON Schema Form](https://react-jsonschema-form.readthedocs.io/) (`@rjsf/core`) wrapped by the `SpruceForm` component with LeafyGreen UI widgets.

**Data flow:** GraphQL response → `gqlToForm` → form state → `formToGql` → mutation input. The form state shape can differ from the GraphQL shape to better suit UI grouping.

**State management:** The `AdminSettingsProvider` in `Context.tsx` uses `useReducer` (via `useSettingsState`) to track each sub-tab's form data and change status. `BaseTab` connects individual sub-tabs to this context through `usePopulateForm` and `useAdminSettingsContext`.

**Central transformer registry:** `tabs/transformers.ts` maps each `AdminSettingsGeneralSection` value to its `gqlToForm`/`formToGql` pair. This registry is consumed by `Tabs.tsx` (to build initial form state from GraphQL data) and `AdminSaveButton.tsx` (to build the mutation payload from changed tabs).

## Adding a New Field to an Existing Sub-Tab

Use the **WebTab** as a reference. The steps below walk through adding a hypothetical `maxRequestSize` (number) field and a `maintenanceMode` (boolean toggle) to WebTab's API section.

### Step 1: Update the GraphQL Schema

If the field is new on the backend, update the Evergreen GraphQL schema so it appears in both the query response type and the mutation input type. Then regenerate types:

```bash
pnpm codegen
```

### Step 2: Add the Field to `types.ts`

Add the new fields to the form state interface so TypeScript tracks them.

```typescript
// tabs/GeneralTab/WebTab/types.ts
export interface WebFormState {
  web: {
    api: {
      httpListenAddr: string;
      url: string;
      corpUrl: string;
      maxRequestSize: number;    // new
      maintenanceMode: boolean;  // new
    };
    // ... other sections unchanged
  };
}
```

### Step 3: Add Field Schema and UI Schema in `schemaFields.ts`

Define the JSON Schema (type, title, validation) and UI Schema (widget, layout) for each new field.

```typescript
// tabs/GeneralTab/WebTab/schemaFields.ts
export const api = {
  schema: {
    // ... existing fields ...
    maxRequestSize: {
      type: "number" as const,
      title: "Max Request Size (bytes)",
      minimum: 0,
    },
    maintenanceMode: {
      type: "boolean" as const,
      title: "Maintenance Mode",
    },
  },
  uiSchema: {
    // Only needed if the field requires non-default rendering.
    maintenanceMode: {
      "ui:widget": widgets.ToggleWidget,
      "ui:description": "When enabled, the API rejects non-admin requests.",
    },
  },
};
```

Fields are rendered in the order they appear in the `schema.properties` object. The `uiSchema` entry is optional — omit it if the default widget is sufficient.

#### Available Widgets

| Widget | Use Case |
|---|---|
| `TextWidget` | Single-line string input (default for `type: "string"`) |
| `TextareaWidget` | Multi-line text |
| `CheckboxWidget` | Boolean checkbox (default for `type: "boolean"`) |
| `ToggleWidget` | Boolean toggle switch |
| `SelectWidget` | Dropdown select |
| `RadioWidget` | Radio buttons |
| `RadioBoxWidget` | Radio box group |
| `DateWidget` | Date picker |
| `DateTimeWidget` | Date + time picker |
| `MultiSelectWidget` | Multi-select dropdown |
| `ChipInputWidget` | Tag/chip input for string arrays |
| `SegmentedControlWidget` | Segmented control |
| `CopyableWidget` | Read-only text with copy button |

#### Layout Templates

- **`CardFieldTemplate`** — Wraps a section in a card. Primary template for settings sections.
- **`AccordionFieldTemplate`** — Wraps a section in a collapsible accordion.
- **`FieldRow`** — Renders fields horizontally in a row.

#### Validation

Three layers of validation are available:

1. **JSON Schema constraints** — `type`, `required`, `minimum`, `maximum`, `pattern`, `enum`, etc. defined directly in the schema.
2. **Custom format validators** — Use the `format` key (e.g. `format: "validURL"`, `format: "validEmail"`, `format: "validJiraTicket"`). Available formats are defined in `components/SpruceForm/customFormats.ts`.
3. **Programmatic `validate` function** — For cross-field validation, pass a `validate` prop to `BaseTab`. This receives the full form data and an error object.

### Step 4: Reference the New Fields in `getFormSchema.ts`

If you added fields to an existing section in `schemaFields.ts`, they are automatically included via the spread (`...api.schema` / `...api.uiSchema`). No changes needed unless you are adding an entirely new section.

To add a new card section, add a new property under `schema.properties` and a corresponding `uiSchema` entry:

```typescript
// tabs/GeneralTab/WebTab/getFormSchema.ts
schema: {
  properties: {
    web: {
      properties: {
        // ... existing sections ...
        newSection: {
          type: "object" as const,
          title: "New Section",
          properties: {
            ...newSection.schema,
          },
        },
      },
    },
  },
},
uiSchema: {
  web: {
    // ... existing sections ...
    newSection: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...newSection.uiSchema,
    },
  },
},
```

### Step 5: Update `gqlToForm` in `transformers.ts`

Map the new fields from the GraphQL query response to the form state shape. Provide sensible defaults for nullable fields.

```typescript
// tabs/GeneralTab/WebTab/transformers.ts
export const gqlToForm = ((data) => {
  if (!data) return null;
  const { api } = data;
  const {
    corpUrl,
    httpListenAddr: apiHttpListenAddr,
    maintenanceMode,  // new — destructure from GQL data
    maxRequestSize,   // new
    url: apiUrl,
  } = api ?? {};

  return {
    web: {
      api: {
        httpListenAddr: apiHttpListenAddr ?? "",
        url: apiUrl ?? "",
        corpUrl: corpUrl ?? "",
        maxRequestSize: maxRequestSize ?? 0,    // new — default to 0
        maintenanceMode: maintenanceMode ?? false, // new — default to false
      },
      // ... other sections unchanged
    },
  };
}) satisfies GqlToFormFunction<Tab>;
```

### Step 6: Update `formToGql` in `transformers.ts`

Map the form state back to the GraphQL mutation input shape.

```typescript
// tabs/GeneralTab/WebTab/transformers.ts
export const formToGql = (({ web }) => {
  const { api, betaFeatures, disabledGQLQueries, ui } = web;
  return {
    api, // api now includes maxRequestSize and maintenanceMode
    ui: {
      ...ui,
      betaFeatures,
    },
    disabledGQLQueries: disabledGQLQueries.queryNames,
  };
}) satisfies FormToGqlFunction<Tab>;
```

If the form state shape matches the mutation input shape for a section (as `api` does here), spreading the object directly works. If the shapes differ, restructure the data explicitly.

### Step 7: Update `transformers.test.ts`

Add the new fields to both the `form` and `gql` test fixtures to verify roundtrip correctness.

```typescript
// tabs/GeneralTab/WebTab/transformers.test.ts
const form: WebFormState = {
  web: {
    api: {
      httpListenAddr: "http://localhost:8080",
      url: "http://localhost:9090",
      corpUrl: "http://corp.example.com",
      maxRequestSize: 1048576,    // new
      maintenanceMode: false,     // new
    },
    // ... rest unchanged
  },
};

const gql: AdminSettingsInput = {
  api: {
    httpListenAddr: "http://localhost:8080",
    url: "http://localhost:9090",
    corpUrl: "http://corp.example.com",
    maxRequestSize: 1048576,    // new
    maintenanceMode: false,     // new
  },
  // ... rest unchanged
};
```

### Step 8: Update `testData.ts` If Needed

If the new fields exist in the top-level `AdminSettings` GraphQL type (used as shared mock data), add them to `tabs/testData.ts`:

```typescript
// tabs/testData.ts
export const adminSettings: AdminSettings = {
  // ...
  api: {
    httpListenAddr: "http://localhost:8080",
    url: "http://localhost:9090",
    corpUrl: "http://corp.example.com",
    maxRequestSize: 1048576,    // new
    maintenanceMode: false,     // new
  },
  // ...
};
```

## Adding a New Sub-Tab

To add an entirely new sub-tab (e.g. "Networking") under the General route:

### Step 1: Create the Sub-Tab Directory

Create `tabs/GeneralTab/NetworkingTab/` with six files following the WebTab pattern:

| File | Purpose |
|---|---|
| `types.ts` | `NetworkingFormState` interface defining the form state shape |
| `schemaFields.ts` | Field-level `schema` and `uiSchema` definitions |
| `getFormSchema.ts` | Assembles full JSON Schema + UI Schema, wraps sections with `CardFieldTemplate` |
| `transformers.ts` | `gqlToForm` and `formToGql` functions |
| `transformers.test.ts` | Roundtrip tests verifying both transformers |
| `NetworkingTab.tsx` | Component that calls `getFormSchema()` and renders `BaseTab` |

The tab component should follow this pattern:

```tsx
// tabs/GeneralTab/NetworkingTab/NetworkingTab.tsx
import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const NetworkingTab: React.FC<TabProps> = ({ networkingData }) => {
  const initialFormState = networkingData;
  const formSchema = getFormSchema();
  return (
    <>
      <H2>Networking</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.Networking}
      />
    </>
  );
};
```

### Step 2: Add the Section to the Route Enum

Add the new section to `AdminSettingsGeneralSection` in `constants/routes.ts`:

```typescript
// constants/routes.ts
export enum AdminSettingsGeneralSection {
  // ... existing sections ...
  Networking = "networking",
}
```

### Step 3: Add the Form State Type to `FormStateMap`

Import the new form state type and add it to the map in `tabs/types.ts`:

```typescript
// tabs/types.ts
import { NetworkingFormState } from "./GeneralTab/NetworkingTab/types";

export type FormStateMap = {
  [T in WritableAdminSettingsType]: {
    // ... existing entries ...
    [AdminSettingsGeneralSection.Networking]: NetworkingFormState;
  }[T];
};
```

### Step 4: Register Transformers

Import and register the new tab's transformers in `tabs/transformers.ts`:

```typescript
// tabs/transformers.ts
import * as networking from "./GeneralTab/NetworkingTab/transformers";

export const formToGqlMap = {
  // ... existing entries ...
  [AdminSettingsGeneralSection.Networking]: networking.formToGql,
};

export const gqlToFormMap = {
  // ... existing entries ...
  [AdminSettingsGeneralSection.Networking]: networking.gqlToForm,
};
```

### Step 5: Add the Tab Component to `GeneralTab.tsx`

Import and render the new tab in `tabs/GeneralTab/GeneralTab.tsx`:

```tsx
// tabs/GeneralTab/GeneralTab.tsx
import { NetworkingTab } from "./NetworkingTab/NetworkingTab";

export const GeneralTab: React.FC<Props> = ({ tabData }) => (
  <>
    {/* ... existing tabs ... */}
    <NetworkingTab
      networkingData={tabData[AdminSettingsGeneralSection.Networking]}
    />
  </>
);
```

### Step 6: Add Side Nav Items

Add navigation entries for the new tab in `adminSettings/index.tsx`. Each section gets a `SideNavGroup` with `SideNavItem` children linking to anchored routes:

```tsx
// adminSettings/index.tsx
<SideNavGroup header="Networking">
  <SideNavItem
    as={Link}
    data-cy="navitem-admin-network-config"
    to={getAdminSettingsRoute(
      AdminSettingsTabRoutes.General,
      "network-config",
    )}
  >
    Network Config
  </SideNavItem>
</SideNavGroup>
```

The anchor string (e.g. `"network-config"`) in `getAdminSettingsRoute` corresponds to the `data-cy` values and is used for scroll-to-anchor navigation.

## Checklist

### Adding a field to an existing tab

- [ ] GraphQL schema updated and types regenerated (`pnpm codegen`)
- [ ] `types.ts` — field added to form state interface
- [ ] `schemaFields.ts` — field schema and uiSchema defined
- [ ] `getFormSchema.ts` — new section referenced (if adding a new card section)
- [ ] `transformers.ts` — `gqlToForm` maps from GraphQL data with a default value
- [ ] `transformers.ts` — `formToGql` maps back to mutation input
- [ ] `transformers.test.ts` — test fixtures updated with the new field
- [ ] `testData.ts` — shared mock data updated (if applicable)

### Adding a new sub-tab

- [ ] New directory created with all six files
- [ ] `AdminSettingsGeneralSection` enum updated in `constants/routes.ts`
- [ ] `FormStateMap` updated in `tabs/types.ts`
- [ ] Transformers registered in `tabs/transformers.ts`
- [ ] Tab component added to `GeneralTab.tsx`
- [ ] Side nav items added in `adminSettings/index.tsx`
