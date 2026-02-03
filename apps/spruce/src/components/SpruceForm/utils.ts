import { ObjectFieldTemplateProps } from "@rjsf/core";
import { Unpacked } from "@evg-ui/lib/types";

// Modify a field such that its internal disabled prop is true.
const disableField = (
  property: Unpacked<ObjectFieldTemplateProps["properties"]>,
): Unpacked<ObjectFieldTemplateProps["properties"]>["content"] => ({
  ...property.content,
  props: {
    ...property.content.props,
    disabled: true,
  },
});

// Return child fields to be rendered
// Conditionally disable based on whether it has been flagged as such (i.e. is a private variable that has already been saved).
export const getFields = (
  properties: ObjectFieldTemplateProps["properties"],
  isDisabled: boolean,
): Array<Unpacked<ObjectFieldTemplateProps["properties"]>["content"]> =>
  isDisabled
    ? properties.map(disableField)
    : properties.map(({ content }) => content);

export const STANDARD_FIELD_WIDTH = 400;

/**
 * `transformTitleToId` transforms a title into a string that can be used as an id.
 * @param title - the title to transform
 * @returns - a string with spaces replaced by hyphens and all lowercase
 */
export const transformTitleToId = (title: string): string =>
  title.toLowerCase().replace(/ /g, "-");
