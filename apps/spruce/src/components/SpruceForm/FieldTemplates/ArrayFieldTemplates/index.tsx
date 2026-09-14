import { SerializedStyles } from "@emotion/react";
import { Button } from "@leafygreen-ui/button";
import { ExpandableCard } from "@leafygreen-ui/expandable-card";
import { Body } from "@leafygreen-ui/typography";
import {
  ArrayFieldItemTemplateProps,
  ArrayFieldTemplateProps,
} from "@rjsf/utils";
import ArrowDown from "@via-ds/icons/ArrowDown";
import ArrowUp from "@via-ds/icons/ArrowUp";
import Trash from "@via-ds/icons/Trash";
import { cx } from "@evg-ui/lib/utils/css";
import { PlusButton } from "components/Buttons";
import ElementWrapper from "../../ElementWrapper";
import { emotionCssToClassName } from "../../utils";
import styles from "./index.module.css";

export const ArrayFieldItemTemplate: React.FC<ArrayFieldItemTemplateProps> = ({
  buttonsProps,
  children,
  disabled,
  index,
  itemKey,
  parentUiSchema = {},
  readonly,
  uiSchema = {},
}) => {
  const {
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    onMoveDownItem,
    onMoveUpItem,
    onRemoveItem,
  } = buttonsProps;
  const arrayItemCss = parentUiSchema["ui:arrayItemCSS"] as SerializedStyles;
  const border = parentUiSchema["ui:border"] ?? false;
  const topAlignDelete = parentUiSchema["ui:topAlignDelete"] ?? false;
  const useExpandableCard = parentUiSchema["ui:useExpandableCard"] ?? false;
  const itemUiSchema =
    typeof parentUiSchema.items === "function"
      ? {}
      : (parentUiSchema.items ?? {});
  const title = uiSchema["ui:title"] ?? itemUiSchema["ui:title"] ?? "";
  const isDisabled = disabled || readonly;
  const deleteButton = (
    <Button
      data-testid="delete-item-button"
      disabled={isDisabled}
      leftGlyph={<Trash />}
      onClick={onRemoveItem}
      size="small"
    />
  );
  return useExpandableCard ? (
    <ExpandableCard
      className={styles.expandableCard}
      data-testid="expandable-card"
      defaultOpen={!isDisabled}
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
      key={itemKey}
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
              leftGlyph={<ArrowUp />}
              onClick={onMoveUpItem}
            />
          )}
          {hasMoveDown && (
            <Button
              data-testid="array-down-button"
              leftGlyph={<ArrowDown />}
              onClick={onMoveDownItem}
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

export const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  canAdd,
  disabled,
  fieldPathId,
  items,
  onAddClick,
  readonly,
  registry,
  required,
  schema,
  title,
  uiSchema = {},
}) => {
  const { DescriptionFieldTemplate, TitleFieldTemplate } = registry.templates;
  const id = fieldPathId.$id;
  const description = uiSchema["ui:description"] || schema.description;
  const descriptionNode = uiSchema["ui:descriptionNode"];
  const fullWidth = !!uiSchema["ui:fullWidth"];
  const placeholder = uiSchema["ui:placeholder"];
  const showLabel = uiSchema["ui:showLabel"] ?? true;
  const useExpandableCard = uiSchema["ui:useExpandableCard"] ?? false;
  const isDisabled = disabled || readonly;

  const addButtonSize = uiSchema["ui:addButtonSize"] || "small";
  const addButtonText = uiSchema["ui:addButtonText"] || "Add";
  const secondaryButton = uiSchema["ui:secondaryButton"];
  const arraydataTestId = uiSchema["ui:data-testid"];

  const arrayCss = uiSchema["ui:arrayCSS"];
  // Override RJSF's default array behavior; add new elements to beginning of array unless otherwise specified.
  const addToEnd = uiSchema["ui:addToEnd"] ?? false;
  const handleAddClick = (event?: React.MouseEvent) => {
    const addIndex = items.length && !addToEnd ? 0 : undefined;
    (onAddClick as (event?: React.MouseEvent, index?: number) => void)(
      event,
      addIndex,
    );
  };

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
        <TitleFieldTemplate
          id={`${id}__title`}
          registry={registry}
          required={required}
          schema={schema}
          title={title}
          uiSchema={uiSchema}
        />
      )}
      {descriptionNode ||
        (description && (
          <DescriptionFieldTemplate
            description={description}
            id={`${id}__description`}
            registry={registry}
            schema={schema}
            uiSchema={uiSchema}
          />
        ))}
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
        {items.map((p) => p)}
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
