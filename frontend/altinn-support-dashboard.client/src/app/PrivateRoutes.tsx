import { Outlet } from "react-router-dom";
import { Spinner } from "@digdir/designsystemet-react";
import { useAuthDetails } from "../hooks/ansattportenHooks";
import { initiateSignIn } from "../utils/ansattportenApi";

const PrivateRoutes = () => {
  const authDetails = useAuthDetails();

  if (authDetails.isLoading) {
    return <Spinner aria-label="authorizing" data-size="xl" />;
  }

  if (!authDetails.data?.isLoggedIn) {
    initiateSignIn();
    return null;
  }

  return <Outlet />;
};

export default PrivateRoutes;
