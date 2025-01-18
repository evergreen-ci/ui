import type { StorybookConfig } from "@storybook/react-vite";
import { fontStyles, resetStyles } from "@evg-ui/lib/src/components/styles";

export const previewHead: StorybookConfig["previewHead"] = (head) => `
${head}
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
<style type="text/css">
  ${fontStyles}
  ${resetStyles}

  a {
    text-decoration: none;
  }

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }
</style>
`;
