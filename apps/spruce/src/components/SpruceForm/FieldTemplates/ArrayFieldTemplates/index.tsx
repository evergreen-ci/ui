import { SerializedStyles } from "@emotion/react";
import { Button } from "@leafygreen-ui/button";
import { ExpandableCard } from "@leafygreen-ui/expandable-card";
import { Body } from "@leafygreen-ui/typography";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import Icon from "@evg-ui/lib/components/Icon";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { cx } from "@evg-ui/lib/utils/css";
import { PlusButton } from "components/Buttons";
import ElementWrapper from "../../ElementWrapper";
import { emotionCssToClassName } from "../../utils";
import styles from "./index.module.css";

const ArrayItem: React.FC<
  {
    border: boolean;
    title: string;
    topAlignDelete: boolean;
    useExpandableCard: boolean;
    arrayItemCss: SerializedStyles;
  } & Unpacked<ArrayFieldTemplateProps["items"]>
> = ({
  arrayItemCss,
  border,
  children,
  disabled,
  hasMoveDown,
  hasMoveUp,
  hasRemove,
  index,
  onDropIndexClick,
  onReorderClick,
  readonly,
  title,
  topAlignDelete,
  useExpandableCard,
}) => {
  const isDisabled = disabled || readonly;
  const deleteButton = (
    <Button
      data-testid="delete-item-button"
      disabled={isDisabled}
      leftGlyph={<Icon glyph="Trash" />}
      onClick={onDropIndexClick(index)}
      size="small"
    />
  );
  return useExpandableCard ? (
    <ExpandableCard
      className={styles.expandableCard}
      data-testid="expandable-card"
      defaultOpen={!isDisabled}
      // Override LeafyGreen's string typing for title so we can include buttons. (LG-2193)
      title={
        <>
          <span
            className={styles.titleWrapper}
            data-testid="expandable-card-title"
          >
            {title}
          </span>
          {hasRemove && !readonly && deleteButton}
        </>
      }
    >
      {children}
    </ExpandableCard>
  ) : (
    <div
      key={index}
      className={cx(
        styles.arrayItemRow,
        border && index === 0 && styles.firstBordered,
        border && styles.bordered,
        emotionCssToClassName(arrayItemCss),
      )}
    >
      {(hasMoveUp || hasMoveDown) && !readonly && (
        <div
          className={cx(
            styles.orderControls,
            topAlignDelete && styles.topAligned,
          )}
        >
          {hasMoveUp && (
            <Button
              data-testid="array-up-button"
              leftGlyph={<Icon glyph="ArrowUp" />}
              onClick={onReorderClick(index, index - 1)}
            />
          )}
          {hasMoveDown && (
            <Button
              data-testid="array-down-button"
              leftGlyph={<Icon glyph="ArrowDown" />}
              onClick={onReorderClick(index, index + 1)}
            />
          )}
        </div>
      )}
      {children}
      {hasRemove && !useExpandableCard && !readonly && (
        <ElementWrapper
          className={cx(
            styles.deleteButtonWrapper,
            topAlignDelete && styles.topAligned,
          )}
        >
          {deleteButton}
        </ElementWrapper>
      )}
    </div>
  );
};

/**
 * `ArrayFieldTemplate` is a custom field template for arrays that renders an array of fields.
 * @param props ArrayFieldTemplateProps
 * @param props.canAdd - Whether or not the user can add new items to the array.
 * @param props.DescriptionField - A custom field for rendering the array's description.
 * @param props.disabled - Whether or not the field is disabled.
 * @param props.formData - The form's data.
 * @param props.idSchema - The field's ID schema.
 * @param props.items - An array of items to render.
 * @param props.onAddClick - A callback function for when the user clicks the add button.
 * @param props.readonly - Whether or not the field is readonly. // jsdoc/valid-types is disabled for this file due to // https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/104
 * @param props.required - Whether or not the field is required.
 * @param props.schema - The field's schema.
 * @param props.title - The field's title.
 * @param props.TitleField - A custom field for rendering the array's title.
 * @param props.uiSchema - The field's UI schema.
 * @returns JSX.Element
 */
export const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  DescriptionField,
  TitleField,
  canAdd,
  disabled,
  formData,
  idSchema,
  items,
  onAddClick,
  readonly,
  required,
  schema,
  title,
  uiSchema,
}) => {
  const id = idSchema.$id;
  const description = uiSchema["ui:description"] || schema.description;
  const border = uiSchema["ui:border"] ?? false;
  const descriptionNode = uiSchema["ui:descriptionNode"];
  const fullWidth = !!uiSchema["ui:fullWidth"];
  const placeholder = uiSchema["ui:placeholder"];
  const showLabel = uiSchema["ui:showLabel"] ?? true;
  const topAlignDelete = uiSchema["ui:topAlignDelete"] ?? false;
  const useExpandableCard = uiSchema["ui:useExpandableCard"] ?? false;
  const isDisabled = disabled || readonly;

  const addButtonSize = uiSchema["ui:addButtonSize"] || "small";
  const addButtonText = uiSchema["ui:addButtonText"] || "Add";
  const secondaryButton = uiSchema["ui:secondaryButton"];
  const arraydataTestId = uiSchema["ui:data-testid"];

  const arrayCss = uiSchema["ui:arrayCSS"];
  const arrayItemCss = uiSchema["ui:arrayItemCSS"];

  // Override RJSF's default array behavior; add new elements to beginning of array unless otherwise specified.
  const addToEnd = uiSchema["ui:addToEnd"] ?? false;
  const handleAddClick =
    items.length && !addToEnd ? items[0].onAddIndexClick(0) : onAddClick;

  const addButton = (
    <PlusButton
      data-testid="add-button"
      disabled={isDisabled}
      onClick={handleAddClick}
      size={addButtonSize}
    >
      {addButtonText}
    </PlusButton>
  );

  const hasAddButton = !readonly && canAdd;
  const buttonAtBeginning = !addToEnd && hasAddButton;
  const buttonAtEnd = addToEnd && hasAddButton;

  return (
    <>
      {showLabel && (
        <TitleField id={`${id}__title`} required={required} title={title} />
      )}
      {descriptionNode || (
        <DescriptionField description={description} id={`${id}__description`} />
      )}
      {buttonAtBeginning && (
        <ElementWrapper className={styles.addButtonContainer}>
          {addButton}
          {secondaryButton}
        </ElementWrapper>
      )}
      <div
        className={cx(
          styles.arrayContainer,
          (fullWidth || useExpandableCard) && styles.fullWidth,
          !!items?.length && styles.hasChildren,
          emotionCssToClassName(arrayCss),
        )}
        data-testid={arraydataTestId}
        id={id}
      >
        {items.length === 0 && placeholder && (
          <Body className={styles.placeholder}>{placeholder}</Body>
        )}
        {items.map((p, i) => (
          <ArrayItem
            {...p}
            key={p.key}
            arrayItemCss={arrayItemCss}
            border={border}
            title={
              formData?.[i]?.displayTitle ??
              uiSchema?.items?.["ui:displayTitle"]
            }
            topAlignDelete={topAlignDelete}
            useExpandableCard={useExpandableCard}
          />
        ))}
        {buttonAtEnd && (
          <ElementWrapper className={styles.addButtonContainer}>
            {addButton}
            {secondaryButton}
          </ElementWrapper>
        )}
      </div>
    </>
  );
};
