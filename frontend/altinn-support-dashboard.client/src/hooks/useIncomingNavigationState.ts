import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Reads router navigation `state` passed in via an EntityLink and clears it
 * from history immediately after, so it doesn't reapply on a later visit
 * (e.g. the user pressing back) and never ends up in the URL.
 */
export function useIncomingNavigationState<T>(): T | undefined {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return location.state as T | undefined;
}
