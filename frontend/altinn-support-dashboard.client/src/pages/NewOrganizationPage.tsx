import OrganizationCreationComponent from "../components/OrganizationCreation/OrganizationCreationComponent";
import { useAppStore } from "../hooks/Appstore";

const NewOrganizationPage: React.FC = () => {
  const environment = useAppStore.getState().environment;
  return (
    <div>
      <OrganizationCreationComponent environment={environment} />
    </div>
  );
};

export default NewOrganizationPage;
