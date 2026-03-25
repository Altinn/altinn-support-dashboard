import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/.auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data?.clientPrincipal != null);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) return null;

  return isLoggedIn ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoutes;
