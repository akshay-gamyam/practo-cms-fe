import { useSelector } from "react-redux";
import { ROUTES } from "../RouterConstant";
import { getToken } from "../../utils/helper";
import { Navigate, useLocation } from "react-router-dom";
import { ROLE_ACCESS } from "../../utils/roleAccess";
import NotFound from "../../components/common/NotFound";


const ALWAYS_ALLOWED_ROUTES = [ROUTES.USER_PROFILE];

const ProtectedRoutes = ({ children,requiredPermissions = [] }) => {
  const location = useLocation();
  const { isAuthenticated, permissions, user } = useSelector((state) => state.auth);
  const token = getToken();

  if (!isAuthenticated || !token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

    const currentPath = location.pathname;

  if (ALWAYS_ALLOWED_ROUTES.includes(currentPath)) {
    return children;
  }

  const allowedRoutes = ROLE_ACCESS[user?.role] || [];

  const isRouteAllowed = allowedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // if (!isRouteAllowed) {
  //   return <Navigate to={ROUTES.DASHBOARD} replace />;
  // }
   if (!isRouteAllowed) {
    return <NotFound />;
  }

  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every((perm) =>
      permissions.includes(perm)
    );

    // if (!hasPermission) {
    //   return <Navigate to={ROUTES.DASHBOARD} replace />;
    // }

     if (!hasPermission) {
      return <NotFound />;
    }
  }

  return children;
};

export default ProtectedRoutes;