import { Navigate } from "react-router-dom";
import { ROUTES } from "../RouterConstant";
import { isAuthenticated } from "../../components/utils/helper";

const ProtectedRoutes = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoutes;
