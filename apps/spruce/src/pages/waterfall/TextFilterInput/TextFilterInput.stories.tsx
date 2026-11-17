import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "storybook/actions";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";

import TextFilterInput from ".";

export default {
  component: TextFilterInput,
} satisfies CustomMeta<typeof TextFilterInput>;

export const Default: CustomStoryObj<typeof TextFilterInput> = {
  render: () => (
    <>
      <TextFilterInput
        ariaLabel="Text Filter Input"
        data-testid="text-filter-input"
        id="text-filter-input"
        label="Text Filter Input"
        onSubmit={action("submit")}
        options={options}
        validator={(v) => v !== "bad"}
        validatorErrorMessage="Invalid Input"
      />
      <Disclaimer>The word `bad` will fail validation</Disclaimer>
    </>
  ),
};

const options = [
  {
    value: "build_variant",
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: "task",
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];
