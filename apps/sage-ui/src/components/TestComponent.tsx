import { useState } from "react";
import { Button } from "@via-ds/components/button";
import { Text, TextStyle } from "@via-ds/components/typography";

export const TestComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Text textStyle={TextStyle.body}>
        Click the button to increase the count: {count}
      </Text>
      <Button onClick={() => setCount((prevCount) => prevCount + 1)}>
        Click me
      </Button>
    </div>
  );
};
