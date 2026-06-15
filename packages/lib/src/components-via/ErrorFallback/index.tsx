import styled from "@emotion/styled";
import { Text, TextStyle, Link } from "@via-ds/components/typography";
import errorPage from "../../components/ErrorBoundary/ErrorFallback/errorPage.svg";
import { palette } from "../../constants/tokens-via";

interface ErrorFallbackProps {
  homeURL: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ homeURL }) => (
  <Center data-cy="error-fallback">
    <Paragraph>
      <WhiteText textStyle={TextStyle.heading1}>
        Ouch! That&apos;s gotta hurt,
        <br /> sorry about that!
      </WhiteText>
      <WhiteText textStyle={TextStyle.heading3}>
        Something went wrong.
      </WhiteText>
      <WhiteLink href={homeURL}>Back To Home</WhiteLink>
    </Paragraph>
    <img alt="Error Background" src={errorPage} />
  </Center>
);

const Center = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Paragraph = styled.div`
  position: absolute;
`;

const WhiteText = styled(Text)`
  color: ${palette.white};
`;

const WhiteLink = styled(Link)`
  color: ${palette.white};
  text-decoration: underline;
`;
