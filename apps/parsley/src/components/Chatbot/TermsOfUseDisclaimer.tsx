import styled from "@emotion/styled";
import InlineDefinition from "@leafygreen-ui/inline-definition";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";

const TermsOfUseDisclaimer = () => (
  <Container>
    <Body>Terms of Use</Body>
    <StyledDisclaimer>
      Parsley AI is powered by generative AI and its responses may be inaccurate
      or incomplete.
    </StyledDisclaimer>
    <InlineDefinition definition="Generative AI models may generate incorrect or misleading information. Please review the output carefully. Parsley AI is meant to assist you with your investigations and not to replace your own judgement.">
      Please review the output carefully.
    </InlineDefinition>
  </Container>
);

const StyledDisclaimer = styled(Disclaimer)`
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  justify-content: center;
  align-items: center;
`;

export default TermsOfUseDisclaimer;
