import { useState } from "react";
import { Button } from "@via-ds/components/button";
import { Text, TextStyle } from "@via-ds/components/typography";

export const TestComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [, handleAsyncError] = useState();

  const handleClick = async () => {
    try {
      throw new Error("Something went wrong!");
    } catch (error) {
      handleAsyncError(() => {
        throw error;
      });
    }
  };

  return (
    <div>
      <Text textStyle={TextStyle.body}>
        Click the button to increase the count: <span>{count}</span>
      </Text>
      <Button onClick={() => setCount((prevCount) => prevCount + 1)}>
        Click me
      </Button>
      <Button onClick={handleClick}>Break the app!</Button>
    </div>
  );
};
