import { Text, TextStyle } from "@via-ds/components/typography";
import { TestComponent } from "components/TestComponent";

const App = () => (
  <div>
    <Text textStyle={TextStyle.heading1}>This is the Sage UI</Text>
    <TestComponent />
  </div>
);

export default App;
