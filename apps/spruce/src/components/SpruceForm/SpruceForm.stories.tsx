import { useState } from "react";
import { action } from "storybook/actions";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
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
  formData: {
    cloneMethod: "legacy-ssh",
    expansions: [{ key: "Sample Input", value: "Sample Input" }],
  },
  schema: {
    properties: {
      cloneMethod: {
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
        title: "Project Cloning Method",
        type: "string" as const,
      },
      expansions: {
        items: {
          properties: {
            key: {
              type: "string" as const,
            },
            value: {
              type: "string" as const,
            },
          },
          type: "object" as const,
        },
        title: "Expansions",
        type: "array" as const,
      },
      validProjects: {
        placeholder: "Sample input",
        title: "Valid Projects",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
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
    validProjects: {
      "ui:options": {
        label: false,
        rows: 5,
      },
      "ui:widget": "textarea",
    },
  },
};

const example2Def = {
  formData: {
    decommissionHosts: true,
    disableQueue: false,
    disableShallowClone: false,
    distroIsCluster: false,
  },
  schema: {
    properties: {
      decommissionHosts: {
        title: "Decommission hosts of this distro for this update",
        type: "boolean" as const,
      },
      disableQueue: {
        title:
          "Disable queueing this distro. Tasks already in the task queue will be removed.",
        type: "boolean" as const,
      },
      disableShallowClone: {
        title: "Disable shallow clone for this distro.",
        type: "boolean" as const,
      },
      distroIsCluster: {
        title:
          "Mark distro as a cluster (jobs are not run on this host, used for special purposes).",
        type: "boolean" as const,
      },
      reprovisionMethod: {
        enum: ["restartJasper", "reprovisionHosts"],
        enumNames: [
          "Restart Jasper service on running hosts of this distro for this update",
          "Reprovision running hosts of this distro for this update",
        ],
        title: "",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    reprovisionMethod: {
      "ui:options": {
        bold: true,
        label: false,
      },
      "ui:widget": "radio",
    },
    "ui:options": {
      label: false,
    },
  },
};

const example3Def = {
  formData: {
    visible: true,
  },
  schema: {
    properties: {
      invisible: {
        description: "This field should be invisible",
        properties: {
          child: {
            title: "And so should its children",
            type: "string" as const,
          },
        },
        title: "Invisible",
        type: "object" as const,
      },
      visible: {
        title: "This is the only visible page element",
        type: "boolean" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    invisible: {
      "ui:widget": "hidden",
    },
  },
};

const example4Def = {
  formData: {
    testText: ["text1", "text2", "text3"],
  },
  schema: {
    properties: {
      testText: {
        default: [],
        items: {
          properties: {
            value: {
              type: "string" as const,
            },
          },
          type: "string" as const,
        },
        title: "This is the only visible page element",
        type: "array" as const,
        uniqueItems: true,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    testText: {
      "ui:widget": widgets.ChipInputWidget,
    },
  },
};

const dateTimeSchema = {
  formData: {},
  schema: {
    properties: {
      nextRunTime: {
        default: new Date(
          "Tue Sep 16 2025 11:19:00 GMT-0400 (Eastern Daylight Time)",
        ).toString(),
        title: "Next Run Time",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    nextRunTime: {
      "ui:widget": "date-time",
    },
  },
};
