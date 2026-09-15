import { createRef } from "react";
import Form from "@rjsf/core";
import { render } from "@evg-ui/lib/test_utils";
import { formSchema } from "./getFormSchema";

const validateResourceTags = (mongodbEnv: string, mongodbOwner: string) => {
  const ref = createRef<InstanceType<typeof Form>>();
  const formData = {
    providers: {
      aws: {
        resourceTags: { mongodbEnv, mongodbOwner },
      },
    },
  };

  render(
    <Form
      ref={ref}
      customFormats={{ validEmail: () => true }}
      formData={formData}
      schema={formSchema.schema}
    />,
  );

  return ref.current?.validate(formData).errors ?? [];
};

describe("providers tab validation", () => {
  it("allows resource tags to be unset", () => {
    expect(validateResourceTags("", "")).toHaveLength(0);
  });

  it("allows an owner without an environment", () => {
    expect(validateResourceTags("", "evergreen@mongodb.com")).toHaveLength(0);
  });

  it("allows an environment without an owner", () => {
    expect(validateResourceTags("staging", "")).toHaveLength(0);
  });
});
