import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectUserSession } from "@/features/slice/userSession/userSessionSlice";

export default function ProtectedRouteWrapper() {
  console.log("In protected route wrapper")
  const { userAccount, isAuth } = useSelector(selectUserSession);
  console.log({userAccount, isAuth});
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginRoute = location.pathname === "/auth/login";
  console.log("pathname", location.pathname);
  console.log("is login route", isLoginRoute)
  const isMissingUser = !isAuth || !userAccount?.id || !userAccount?.email;

  useEffect(() => {
    if (!isLoginRoute && isMissingUser) {
      console.log("redirecting home")
      navigate("/", { replace: true });
    }
  }, [isLoginRoute, isMissingUser, navigate]);

  if (isLoginRoute) return <Outlet />;
  if (isMissingUser) return null;

  return <Outlet />;
}
