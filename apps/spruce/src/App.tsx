import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import { ContextProviders } from "context/Providers";

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <ContextProviders>
        <Content />
      </ContextProviders>
    ),
  },
]);

const App: React.FC = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <RouterProvider router={router} />
  </ErrorBoundary>
);

export default App;
