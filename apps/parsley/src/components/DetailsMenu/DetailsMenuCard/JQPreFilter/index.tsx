import styled from "@emotion/styled";
import TextArea from "@leafygreen-ui/text-area";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { DetailRow, DetailsLabel } from "../styles";

const JQPreFilter: React.FC = () => {
  const [jqPreFilter, setJQPreFilter] = useQueryParam<string | undefined>(
    QueryParams.JQPreFilter,
    undefined,
  );

  const updateJQPreFilter = (newVal: string) => {
    if (newVal === "") {
      setJQPreFilter(undefined);
    } else {
      setJQPreFilter(newVal);
    }
  };

  return (
    <StyledDetailRow>
      <DetailsLabel label="Pre-filter the log with jq.">
        jq Pre-Filter
      </DetailsLabel>

      <JQPreFilterContainer>
        <TextArea
          description="Parsley will pre-filter your log file with this filter."
          label="jq Pre-Filter"
          onChange={(e) => updateJQPreFilter(e.target.value)}
          value={jqPreFilter ?? ""}
        />
      </JQPreFilterContainer>
    </StyledDetailRow>
  );
};

const StyledDetailRow = styled(DetailRow)`
  align-items: flex-start;
`;

const JQPreFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default JQPreFilter;
