import { Text, TextStyle } from "@via-ds/components/typography";
import { ViaTestComponent } from "@evg-ui/lib/components-via/TestComponent";
import { TestComponent } from "components/TestComponent";

const App = () => (
  <div>
    <Text textStyle={TextStyle.heading1}>This is the Sage UI</Text>
    <ViaTestComponent />
    <TestComponent />
  </div>
);

export default App;
