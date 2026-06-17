import OrganizationCreationComponent from "../components/OrganizationCreation/OrganizationCreationComponent";
import { useAppStore } from "../stores/Appstore";

const NewOrganizationPage: React.FC = () => {
  const environment = useAppStore.getState().environment;
  return (
    <div>
      <OrganizationCreationComponent environment={environment} />
    </div>
  );
};

export default NewOrganizationPage;
