import { Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  // const authDetails = useAuthDetails();
  //
  // if (authDetails.isLoading) {
  //   return <Spinner aria-label="authorizing" data-size="xl" />;
  // }
  //
  return <Outlet />;
};

export default PrivateRoutes;
