import { createFileRoute } from "@tanstack/react-router";
import { TestComponent } from "components/TestComponent";

const HomePage: React.FC = () => (
  <div>
    <p>Home page</p>
    <TestComponent />
  </div>
);

export const Route = createFileRoute("/")({
  component: HomePage,
});
