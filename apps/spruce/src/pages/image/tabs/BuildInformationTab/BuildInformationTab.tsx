import { SettingsCardTitle } from "components/SettingsCard";
import { PackagesTable } from "pages/image/PackagesTable";

export const BuildInformationTab: React.FC = () => (
  <>
    <SettingsCardTitle>Packages</SettingsCardTitle>
    <PackagesTable />
  </>
);
