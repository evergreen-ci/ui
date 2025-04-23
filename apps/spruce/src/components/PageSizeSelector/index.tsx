import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { PAGE_SIZES } from "constants/index";

interface Props {
  value: number;
  onChange: (i: number) => void;
}

/**
 * `data-*` props are not currently supported by @leafygreen-ui/select
 *  https://jira.mongodb.org/browse/EVG-16932
 * @param props - React props passed to the component
 * @param props.value - The current page size
 * @param props.onChange - Callback to be called when the page size is changed
 * @returns The PageSizeSelector component
 */
const PageSizeSelector: React.FC<Props> = ({ onChange, value, ...rest }) => (
  <StyledSelect
    allowDeselect={false}
    aria-labelledby="page-size-select"
    onChange={(pageSize: string) => onChange(parseInt(pageSize, 10))}
    popoverZIndex={zIndex.popover}
    size="small"
    value={value.toString()}
    {...rest}
  >
    {PAGE_SIZES.map((limit) => (
      <Option key={limit} value={limit.toString()}>{`${limit} / page`}</Option>
    ))}
  </StyledSelect>
);

const StyledSelect = styled(Select)`
  width: 120px;
`;

export default PageSizeSelector;
