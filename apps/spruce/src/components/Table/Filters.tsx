import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { FilterDropdownProps } from "antd/es/table/interface";
import { CheckboxGroup } from "components/Checkbox";
import Icon from "components/Icon";
import { tableInputContainerCSS } from "components/styles/Table";
import {
  TreeDataEntry,
  TreeSelect,
  TreeSelectProps,
} from "components/TreeSelect";
import { fontSize } from "constants/tokens";

const { blue, gray } = palette;
const defaultColor = gray.light1;

export interface InputFilterProps {
  "data-cy"?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilter: () => void;
  visible?: boolean;
}

export const InputFilter = ({
  "data-cy": dataCy,
  onChange,
  onFilter,
  placeholder,
  value,
  visible,
}: InputFilterProps) => {
  const inputEl = useRef(null);

  useEffect(() => {
    if (visible && inputEl?.current) {
      // timeout prevents race condition with antd table animation
      const timer = setTimeout(() => {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        inputEl.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible, inputEl]);

  return (
    <FilterWrapper data-cy={`${dataCy}-wrapper`}>
      <TextInput
        ref={inputEl}
        aria-label="Search Table"
        data-cy={`${dataCy}-input-filter`}
        description="Press enter to filter."
        onChange={onChange}
        onKeyPress={(e) => e.key === "Enter" && onFilter()}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </FilterWrapper>
  );
};

export const getColumnSearchFilterProps = ({
  "data-cy": dataCy,
  onChange,
  onFilter,
  placeholder,
  value,
}: InputFilterProps) => ({
  filterDropdown: ({ confirm, visible }: FilterDropdownProps) => (
    <InputFilter
      data-cy={dataCy}
      onChange={onChange}
      onFilter={() => {
        onFilter();
        confirm({ closeDropdown: true });
      }}
      placeholder={placeholder}
      value={value}
      visible={visible}
    />
  ),
  filterIcon: () => (
    <StyledFilterWrapper>
      <Icon
        data-cy={dataCy}
        fill={value.length > 0 ? blue.light1 : defaultColor}
        glyph="MagnifyingGlass"
      />
    </StyledFilterWrapper>
  ),
});

export const getColumnTreeSelectFilterProps = ({
  "data-cy": dataCy,
  onChange,
  state,
  tData,
}: TreeSelectProps) => ({
  filterDropdown: () => (
    <TreeSelect
      data-cy={dataCy}
      onChange={onChange}
      state={state}
      tData={tData}
    />
  ),
  filterIcon: () => (
    <StyledFilterWrapper>
      <Icon
        data-cy={dataCy}
        fill={state.length > 0 ? blue.light1 : defaultColor}
        glyph="Filter"
      />
    </StyledFilterWrapper>
  ),
});

export interface CheckboxFilterProps {
  dataCy?: string;
  statuses: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}

export const CheckboxFilter = ({
  dataCy,
  onChange,
  statuses,
  value,
}: CheckboxFilterProps) => (
  <FilterWrapper data-cy={`${dataCy}-wrapper`}>
    <CheckboxGroup data={statuses} onChange={onChange} value={value} />
  </FilterWrapper>
);

export const getColumnCheckboxFilterProps = ({
  dataCy,
  onChange,
  statuses,
  value,
}: CheckboxFilterProps) => ({
  filterDropdown: ({ confirm }: FilterDropdownProps) => (
    <CheckboxFilter
      dataCy={dataCy}
      onChange={(e, key) => {
        onChange(e, key);
        confirm({ closeDropdown: true });
      }}
      statuses={statuses}
      value={value}
    />
  ),
  filterIcon: () => (
    <StyledFilterWrapper>
      <Icon
        data-cy={dataCy}
        fill={value.length > 0 ? blue.light1 : defaultColor}
        glyph="Filter"
      />
    </StyledFilterWrapper>
  ),
});

const FilterWrapper = styled.div`
  ${tableInputContainerCSS}
  min-width: 200px; // need to set this as side effect of getPopupContainer
  font-weight: normal; // need to set this as side effect of getPopupContainer
`;

const StyledFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  font-size: ${fontSize.l};
`;
