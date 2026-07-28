import { SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { ExpandableCard } from "@leafygreen-ui/expandable-card";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import {
  ArrayFieldItemTemplateProps,
  ArrayFieldTemplateProps,
} from "@rjsf/utils";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { PlusButton } from "components/Buttons";
import ElementWrapper from "../../ElementWrapper";
import { STANDARD_FIELD_WIDTH } from "../../utils";

const { gray } = palette;
// Total pixel count above a text field with a label. Used to align buttons to the
// top of the text box itself.
const labelOffset = size.m;

export const ArrayFieldItemTemplate: React.FC<ArrayFieldItemTemplateProps> = ({
  buttonsProps,
  children,
  disabled,
  index,
  itemKey,
  parentUiSchema = {},
  readonly,
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
  const title = itemUiSchema["ui:displayTitle"] ?? "";
  const isDisabled = disabled || readonly;
  const deleteButton = (
    <Button
      data-cy="delete-item-button"
      disabled={isDisabled}
      leftGlyph={<Icon glyph="Trash" />}
      onClick={onRemoveItem}
      size="small"
    />
  );
  return useExpandableCard ? (
    <StyledExpandableCard
      data-cy="expandable-card"
      defaultOpen={!isDisabled}
      // Override LeafyGreen's string typing for title so we can include buttons. (LG-2193)
      title={
        <>
          <TitleWrapper data-cy="expandable-card-title">{title}</TitleWrapper>
          {hasRemove && !readonly && deleteButton}
        </>
      }
    >
      {children}
    </StyledExpandableCard>
  ) : (
    <ArrayItemRow
      key={itemKey}
      border={border}
      css={arrayItemCss}
      index={index}
    >
      {(hasMoveUp || hasMoveDown) && !readonly && (
        <OrderControls topAlignDelete={topAlignDelete}>
          {hasMoveUp && (
            <Button
              data-cy="array-up-button"
              leftGlyph={<Icon glyph="ArrowUp" />}
              onClick={onMoveUpItem}
            />
          )}
          {hasMoveDown && (
            <Button
              data-cy="array-down-button"
              leftGlyph={<Icon glyph="ArrowDown" />}
              onClick={onMoveDownItem}
            />
          )}
        </OrderControls>
      )}
      {children}
      {hasRemove && !useExpandableCard && !readonly && (
        <DeleteButtonWrapper topAlignDelete={topAlignDelete}>
          {deleteButton}
        </DeleteButtonWrapper>
      )}
    </ArrayItemRow>
  );
};

const ArrayItemRow = styled.div<{ border: boolean; index: number }>`
  display: flex;
  ${({ border, index }) =>
    border && index === 0 && `border-top: 1px solid ${gray.light1}`};
  ${({ border }) =>
    border &&
    `border-bottom: 1px solid ${gray.light1};
  margin: 0 -${size.m};
  padding: ${size.m};
    `};

  .rjsf-field-object {
    flex-grow: 1;
  }
`;

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
  const id = fieldPathId.$id;
  const { DescriptionFieldTemplate, TitleFieldTemplate } = registry.templates;
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
  const arrayDataCy = uiSchema["ui:data-cy"];

  const arrayCss = uiSchema["ui:arrayCSS"];

  // Override RJSF's default array behavior; add new elements to beginning of array unless otherwise specified.
  const addToEnd = uiSchema["ui:addToEnd"] ?? false;
  const handleAddClick =
    items.length && !addToEnd
      ? (event?: React.MouseEvent) =>
          (onAddClick as (event?: React.MouseEvent, index?: number) => void)(
            event,
            0,
          )
      : onAddClick;

  const addButton = (
    <PlusButton
      data-cy="add-button"
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
      {descriptionNode || (
        <DescriptionFieldTemplate
          description={description ?? ""}
          id={`${id}__description`}
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
        />
      )}
      {buttonAtBeginning && (
        <AddButtonContainer>
          {addButton}
          {secondaryButton}
        </AddButtonContainer>
      )}
      <ArrayContainer
        css={arrayCss}
        data-cy={arrayDataCy}
        fullWidth={fullWidth || useExpandableCard}
        hasChildren={!!items?.length}
        id={id}
      >
        {items.length === 0 && placeholder && (
          <Placeholder>{placeholder}</Placeholder>
        )}
        {items}
        {buttonAtEnd && (
          <AddButtonContainer>
            {addButton}
            {secondaryButton}
          </AddButtonContainer>
        )}
      </ArrayContainer>
    </>
  );
};

const AddButtonContainer = styled(ElementWrapper)`
  margin-top: ${size.s};
  display: flex;

  > :not(:last-of-type) {
    margin-right: ${size.xs};
  }
`;

type ArrayContainerProps = {
  hasChildren: boolean;
  fullWidth?: boolean;
};

const ArrayContainer = styled.div<ArrayContainerProps>`
  ${({ hasChildren }) => hasChildren && `margin-bottom: ${size.m};`}
  min-width: min-content;
  ${({ fullWidth }) =>
    fullWidth ? "max-width: unset" : `max-width: ${STANDARD_FIELD_WIDTH}px;`}
`;

const DeleteButtonWrapper = styled(ElementWrapper)`
  margin-left: ${size.s};
  // Align button with top of input unless it should specifically align to the top of the ArrayItemRow
  margin-top: ${({ topAlignDelete }: { topAlignDelete: boolean }) =>
    topAlignDelete ? "0px" : labelOffset};
`;

const StyledExpandableCard = styled(ExpandableCard)`
  margin-bottom: ${size.l};
`;

const OrderControls = styled.div<{ topAlignDelete: boolean }>`
  display: flex;
  flex-direction: column;
  margin-right: ${size.s};
  margin-top: ${({ topAlignDelete }) => (topAlignDelete ? "0px" : labelOffset)};

  > :not(:last-of-type) {
    margin-bottom: ${size.xs};
  }
`;

const TitleWrapper = styled.span`
  margin-right: ${size.s};
`;

const Placeholder = styled(Body)`
  margin-bottom: ${size.m};
`;
