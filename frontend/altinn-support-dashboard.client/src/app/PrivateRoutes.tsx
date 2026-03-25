import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  // const authDetails = useAuthDetails();
  //
  // if (authDetails.isLoading) {
  //   return <Spinner aria-label="authorizing" data-size="xl" />;
  // }
  // return authDetails?.data?.isLoggedIn ? <Outlet /> : <Navigate to="/signin" />;
  const isLoggedInList = (window.location.href = `/.auth/me`);

  return isLoggedInList.length <= 0 ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoutes;
