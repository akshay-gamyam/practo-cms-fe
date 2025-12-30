import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../RouterConstant";
import { getToken, ROLE_VARIABLES_MAP } from "../../utils/helper";

const PublicRoutes = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const token = getToken();

  if (isAuthenticated && token) {
    if (user?.role === ROLE_VARIABLES_MAP?.MEDICAL_AFFAIRS) {
      return <Navigate to={ROUTES.MEDICAL_TOPICS} replace />;
    } else if (user?.role === ROLE_VARIABLES_MAP?.BRAND_REVIEWER) {
      return <Navigate to={ROUTES.REVIEW_QUEUE} replace />;
    } else if (user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR) {
      return <Navigate to={ROUTES.MY_TOPICS} replace />;
    } else if (user?.role === ROLE_VARIABLES_MAP?.AGENCY_POC) {
      return <Navigate to={ROUTES.AGENCY_POC} replace />;
    } else if (user?.role === ROLE_VARIABLES_MAP?.PUBLISHER) {
      return <Navigate to={ROUTES.REVIEW_QUEUE} replace />;
    } else if (user?.role === ROLE_VARIABLES_MAP?.SUPER_ADMIN) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    } else if (user?.role === ROLE_VARIABLES_MAP?.CONTENT_APPROVER) {
      return <Navigate to={ROUTES.CONTENT_APPROVER_SCRIPTS} replace />;
    }
    // return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default PublicRoutes;
