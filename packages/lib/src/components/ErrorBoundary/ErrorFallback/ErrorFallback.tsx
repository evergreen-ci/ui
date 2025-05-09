import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { H1, H1Props, H2, H2Props } from "@leafygreen-ui/typography";
import { size } from "../../../constants/tokens";
import errorPage from "./errorPage.svg";

const { white } = palette;

interface ErrorFallbackProps {
  /** The URL to direct the user to if they encounter the error fallback */
  homeURL: string;
}
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ homeURL }) => (
  <Center data-cy="error-fallback">
    <Text>
      <StyledHeader>Error</StyledHeader>
      <StyledSubtitle>
        Ouch! That&apos;s gotta hurt,
        <br /> sorry about that!
      </StyledSubtitle>
      <StyledLink href={homeURL}>Back To Home</StyledLink>
    </Text>
    <img alt="Error Background" src={errorPage} />
  </Center>
);

export default ErrorFallback;

const StyledHeader = styled(H1)<H1Props>`
  color: ${white};
`;

const StyledSubtitle = styled(H2)<H2Props>`
  color: ${white};
`;

const StyledLink = styled.a`
  padding-top: ${size.xl};
  color: ${white};
  text-decoration: underline;
`;

const Text = styled.div`
  position: absolute;
  color: white;
  margin-left: 5%;
  margin-top: 10%;
`;

const Center = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  background-color: #5bbf7d; // Green Color from image
`;
