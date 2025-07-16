import styled from "@emotion/styled";
import {
  Select,
  Option,
  SelectProps,
  Size as SelectSize,
} from "@leafygreen-ui/select";
import { PAGE_SIZES } from "../../constants/pagination";
import { zIndex } from "../../constants/tokens";

interface Props {
  value: number;
  disabled?: boolean;
  onChange: (i: number) => void;
}

/**
 * `data-*` props are not currently supported by @leafygreen-ui/select
 *  https://jira.mongodb.org/browse/EVG-16932
 * @param props - React props passed to the component
 * @param props.value - The current page size
 * @param props.onChange - Callback to be called when the page size is changed
 * @param props.disabled - If the page size selector should be disabled
 * @returns The PageSizeSelector component
 */
const PageSizeSelector: React.FC<Props> = ({
  disabled = false,
  onChange,
  value,
  ...rest
}) => (
  <StyledSelect
    allowDeselect={false}
    aria-labelledby="page-size-select"
    disabled={disabled}
    onChange={(pageSize: string) => onChange(parseInt(pageSize, 10))}
    popoverZIndex={zIndex.popover}
    size={SelectSize.Small}
    value={value.toString()}
    {...rest}
  >
    {PAGE_SIZES.map((limit) => (
      <Option key={limit} value={limit.toString()}>{`${limit} / page`}</Option>
    ))}
  </StyledSelect>
);

const StyledSelect = styled(
  Select as unknown as React.ComponentType<Partial<SelectProps>>,
)`
  width: 120px;
`;

export default PageSizeSelector;
