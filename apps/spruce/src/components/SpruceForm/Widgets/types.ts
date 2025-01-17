import { SerializedStyles } from "@emotion/react";
import { TextInputType } from "@leafygreen-ui/text-input";
import { WidgetProps } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm/types";

export interface SpruceWidgetProps extends WidgetProps {
  options: Partial<{
    "aria-controls": string[];
    ariaLabel: string;
    "data-cy": string;
    ariaLabelledBy: string;
    bold: boolean;
    customLabel: string;
    description: string;
    descriptionNode: React.ReactElement;
    elementWrapperCSS: SerializedStyles;
    emptyValue: string | null;
    errors: string[];
    focusOnMount: boolean;
    inline: boolean;
    inputType: TextInputType;
    rows: number;
    showLabel: boolean;
    sizeVariant: string;
    tooltipDescription: string;
    warnings: string[] | React.ReactElement[];
  }>;
}

export type EnumSpruceWidgetProps = {
  options: {
    enumDisabled: string[];
    enumOptions: Array<{
      schema?: SpruceFormProps["schema"];
      label: string;
      value: string;
    }>;
  };
} & SpruceWidgetProps;
