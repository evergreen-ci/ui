import styled from "@emotion/styled";
import { Button, Variant } from "@leafygreen-ui/button";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { useChatContext } from "../Context";
import { useAuthContext } from "./AuthProvider";

export const Login: React.FC = () => {
  const { appName } = useChatContext();
  const { beginPollingAuth, isPolling, loginUrl } = useAuthContext();

  return (
    <Container>
      <MessageText>{appName} requires separate authentication.</MessageText>
      <Button
        as="a"
        disabled={isPolling}
        href={loginUrl}
        onClick={beginPollingAuth}
        target="_blank"
        variant={Variant.BaseGreen}
      >
        {isPolling ? "Waiting for login..." : "Log in"}
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${size.s};
`;

const MessageText = styled.div`
  font-size: ${fontSize.m};
`;
