import { Navigate, Outlet } from "react-router-dom";
import { useAuthDetails } from "../hooks/ansattportenHooks";
import { Spinner } from "@digdir/designsystemet-react";

const PrivateRoutes = () => {
  const authDetails = useAuthDetails();

  if (authDetails.isLoading) {
    return <Spinner aria-label="authorizing" data-size="xl" />;
  }

  return authDetails?.data?.isLoggedIn ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoutes;
