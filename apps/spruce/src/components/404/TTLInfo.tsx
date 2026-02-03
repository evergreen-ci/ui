import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components";
import { dataRetentionDocumentationUrl } from "constants/externalResources";

const background = palette.green.light3;
const accent = palette.green.light2;

export const TTLInfo = ({ children }: React.PropsWithChildren) => (
  <>
    <SpeechBubble>
      <Subtitle>Looking for something?</Subtitle>
      <Body>
        Versions and tasks expire after 365 days. More on Evergreen&rsquo;s data
        retention policy{" "}
        <StyledLink href={dataRetentionDocumentationUrl}>here</StyledLink>.
      </Body>
    </SpeechBubble>
    {children}
  </>
);

const SpeechBubble = styled.div`
  position: fixed;
  top: 45%;
  left: 55%;
  margin: 0.5rem auto;
  padding: 1.25rem;
  width: 24rem;
  border-radius: 3rem;
  transform: rotate(6deg) rotateY(15deg);
  background: ${accent};
  text-align: center;

  &:before,
  &:after {
    position: absolute;
    z-index: -1;
    content: "";
  }

  &:after {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
    transform: rotate(2deg) translate(0.35rem, -0.15rem) scale(1.02);
    background: ${background};
  }

  &:before {
    border-right: solid 6rem ${background};
    border-bottom: solid 1rem ${accent};
    bottom: 0.25rem;
    left: 12rem;
    height: 1.5rem;
    transform: rotate(105deg) skewX(75deg);
  }
`;
