import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Diff } from "./Diff";

export default {
  component: Diff,
} satisfies CustomMeta<typeof Diff>;

const comprehensiveDiff = `diff --git a/src/components/Button/Button.tsx b/src/components/Button/Button.tsx
index 111111111..222222222 100644
--- a/src/components/Button/Button.tsx
+++ b/src/components/Button/Button.tsx
@@ -8,8 +8,17 @@ interface ButtonProps {
 }
 
 export const Button: React.FC<ButtonProps> = ({ variant, children }) => {
-  return <button className={variant}>{children}</button>;
+  const baseClass = "btn";
+  return <button className={\`\${baseClass} btn-\${variant}\`}>{children}</button>;
 };
+
+export const PrimaryButton: React.FC<ButtonProps> = ({ children }) => {
+  return <Button variant="primary">{children}</Button>;
+};
+
+export const SecondaryButton: React.FC<ButtonProps> = ({ children }) => {
+  return <Button variant="secondary">{children}</Button>;
+};
 
 export default Button;`;

export const Default: CustomStoryObj<typeof Diff> = {
  render: (args) => <Diff {...args} />,
  args: {
    diff: comprehensiveDiff,
  },
};
