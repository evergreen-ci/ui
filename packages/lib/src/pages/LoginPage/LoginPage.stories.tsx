import { AuthProvider } from "context/Auth";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import LoginPage from ".";

export default {
  component: LoginPage,
} as CustomMeta<typeof LoginPage>;

export const Default: CustomStoryObj<typeof LoginPage> = {
  render: () => (
    <AuthProvider
      localAppURL=""
      localAuthURL=""
      remoteAuthURL=""
      shouldUseLocalAuth
    >
      <LoginPage />
    </AuthProvider>
  ),
};
