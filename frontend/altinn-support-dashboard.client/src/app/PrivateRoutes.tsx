import { Outlet } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// import { useAuthDetails } from "../hooks/ansattportenHooks";
// import { Spinner } from "@digdir/designsystemet-react";

const PrivateRoutes = () => {
  // Ansattporten auth (restore when switching back from temporary Azure EntraID login):
  // const authDetails = useAuthDetails();
  // if (authDetails.isLoading) {
  //   return <Spinner aria-label="authorizing" data-size="xl" />;
  // }
  // return authDetails?.data?.isLoggedIn ? <Outlet /> : <Navigate to="/signin" />;

  // Temporary: auth is enforced by Azure App Service (Easy Auth), so no client-side guard needed.
  return <Outlet />;
};

export default PrivateRoutes;
