import { useState } from "react";
import { action } from "storybook/actions";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import widgets from "components/SpruceForm/Widgets";

import { SpruceForm, SpruceFormContainer } from ".";

export default {
  component: SpruceForm,
} satisfies CustomMeta<typeof SpruceForm>;

export const Example1: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      data={example1Def.formData}
      schema={example1Def.schema}
      title="Distro Projects"
      uiSchema={example1Def.uiSchema}
    />
  ),
};

export const Example2: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      data={example2Def.formData}
      schema={example2Def.schema}
      title="Admin Options"
      uiSchema={example2Def.uiSchema}
    />
  ),
};

export const Example3: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      data={example3Def.formData}
      schema={example3Def.schema}
      title="UI Options"
      uiSchema={example3Def.uiSchema}
    />
  ),
};

export const Example4: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      data={example4Def.formData}
      schema={example4Def.schema}
      title="UI Options"
      uiSchema={example4Def.uiSchema}
    />
  ),
};

export const DateTimePicker: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      data={dateTimeSchema.formData}
      schema={dateTimeSchema.schema}
      title="Periodic Builds"
      uiSchema={dateTimeSchema.uiSchema}
    />
  ),
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const BaseForm = ({ data, schema, title, uiSchema }) => {
  const [formState, setFormState] = useState(data);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const onChange = (d) => {
    const { formData } = d;
    action("Change Form State")(formData);
    setFormState(formData);
  };
  return (
    <SpruceFormContainer title={title}>
      <SpruceForm
        formData={formState}
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema}
      />
    </SpruceFormContainer>
  );
};

const example1Def = {
  schema: {
    type: "object" as const,
    properties: {
      cloneMethod: {
        type: "string" as const,
        title: "Project Cloning Method",
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
      },
      expansions: {
        type: "array" as const,
        title: "Expansions",
        items: {
          type: "object" as const,
          properties: {
            key: {
              type: "string" as const,
            },
            value: {
              type: "string" as const,
            },
          },
        },
      },
      validProjects: {
        type: "string" as const,
        title: "Valid Projects",
        placeholder: "Sample input",
      },
    },
  },
  uiSchema: {
    validProjects: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 5,
        label: false,
      },
    },
    cloneMethod: {
      "ui:options": {
        label: false,
      },
    },
    expansions: {
      items: {
        "ui:label": false,
      },
    },
  },
  formData: {
    cloneMethod: "legacy-ssh",
    expansions: [{ key: "Sample Input", value: "Sample Input" }],
  },
};

const example2Def = {
  schema: {
    type: "object" as const,
    properties: {
      distroIsCluster: {
        type: "boolean" as const,
        title:
          "Mark distro as a cluster (jobs are not run on this host, used for special purposes).",
      },
      disableShallowClone: {
        type: "boolean" as const,
        title: "Disable shallow clone for this distro.",
      },
      disableQueue: {
        type: "boolean" as const,
        title:
          "Disable queueing this distro. Tasks already in the task queue will be removed.",
      },
      decommissionHosts: {
        type: "boolean" as const,
        title: "Decommission hosts of this distro for this update",
      },
      reprovisionMethod: {
        title: "",
        type: "string" as const,
        enum: ["restartJasper", "reprovisionHosts"],
        enumNames: [
          "Restart Jasper service on running hosts of this distro for this update",
          "Reprovision running hosts of this distro for this update",
        ],
      },
    },
  },
  uiSchema: {
    reprovisionMethod: {
      "ui:widget": "radio",
      "ui:options": {
        label: false,
        bold: true,
      },
    },
    "ui:options": {
      label: false,
    },
  },
  formData: {
    distroIsCluster: false,
    disableShallowClone: false,
    disableQueue: false,
    decommissionHosts: true,
  },
};

const example3Def = {
  schema: {
    type: "object" as const,
    properties: {
      invisible: {
        type: "object" as const,
        title: "Invisible",
        description: "This field should be invisible",
        properties: {
          child: {
            type: "string" as const,
            title: "And so should its children",
          },
        },
      },
      visible: {
        title: "This is the only visible page element",
        type: "boolean" as const,
      },
    },
  },
  uiSchema: {
    invisible: {
      "ui:widget": "hidden",
    },
  },
  formData: {
    visible: true,
  },
};

const example4Def = {
  schema: {
    type: "object" as const,
    properties: {
      testText: {
        title: "This is the only visible page element",
        type: "array" as const,
        uniqueItems: true,
        default: [],
        items: {
          type: "string" as const,
          properties: {
            value: {
              type: "string" as const,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    testText: {
      "ui:widget": widgets.ChipInputWidget,
    },
  },
  formData: {
    testText: ["text1", "text2", "text3"],
  },
};

const dateTimeSchema = {
  formData: {},
  schema: {
    type: "object" as const,
    properties: {
      nextRunTime: {
        type: "string" as const,
        title: "Next Run Time",
        default: new Date(
          "Tue Sep 16 2025 11:19:00 GMT-0400 (Eastern Daylight Time)",
        ).toString(),
      },
    },
  },
  uiSchema: {
    nextRunTime: {
      "ui:widget": "date-time",
    },
  },
};
