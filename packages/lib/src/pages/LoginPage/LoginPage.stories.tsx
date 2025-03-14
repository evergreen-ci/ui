import { AuthProvider } from "context/AuthProvider";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import LoginPage from ".";

export default {
  component: LoginPage,
} as CustomMeta<typeof LoginPage>;

export const Default: CustomStoryObj<typeof LoginPage> = {
  render: () => (
    <AuthProvider
      evergreenAppURL=""
      localAuthRoute=""
      remoteAuthURL=""
      shouldUseLocalAuth
    >
      <LoginPage />
    </AuthProvider>
  ),
};
