import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./RouterConstant";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../components/home/dashboard/Dashboard";
import ContentLibrary from "../components/home/contentLibrary/ContentLibrary";
import Upload from "../components/home/upload/Upload";
import Settings from "../components/home/settings/Settings";
import ReviewQueue from "../components/home/reviewQueue/ReviewQueue";
import NotFound from "../components/common/NotFound";
import UserManagement from "../components/home/userManagement/UsersManagement";

import PublicRoutes from "./scopeRoute/PublicRoute";
import ProtectedRoutes from "./scopeRoute/ProtectedRoutes";
import AuthLayout from "../components/authentication/AuthLayout";
import MyTopics from "../components/home/myTopics/MyTopics";
import UserProfile from "../components/home/userProfile/UserProfile";
import Notifications from "../components/home/notifications/Notifications";
import MedicalTopics from "../components/home/medicalTopics/MedicalTopics";
import MyDoctorNotes from "../components/home/myDoctorNotes/MyDoctorNotes";
import AgencyPOC from "../components/home/agencyPoc/AgencyPOC";
import Script from "../components/home/agencyPoc/scriptting/Scripting";
import AgencyPocVideos from "../components/home/agencyPoc/agencyPocVideos/AgencyPocVideos";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoutes>
              <AuthLayout />
            </PublicRoutes>
          }
        />

        <Route
          path={ROUTES.FORGET_PASSWORD}
          element={
            <PublicRoutes>
              <AuthLayout />
            </PublicRoutes>
          }
        />

        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <PublicRoutes>
              <AuthLayout />
            </PublicRoutes>
          }
        />

        <Route
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.CONTENT_LIBRARY} element={<ContentLibrary />} />
          <Route path={ROUTES.REVIEW_QUEUE} element={<ReviewQueue />} />
          <Route path={ROUTES.UPLOAD} element={<Upload />} />
          <Route path={ROUTES.UPLOAD_WITH_ID} element={<Upload />} />
          <Route path={ROUTES.MY_DOCTOR_NOTES} element={<MyDoctorNotes />} />
          <Route path={ROUTES.MY_TOPICS} element={<MyTopics />} />
          <Route path={ROUTES.MEDICAL_TOPICS} element={<MedicalTopics />} />
          <Route path={ROUTES.USERS} element={<UserManagement />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />
          <Route path={ROUTES.AGENCY_POC} element={<AgencyPOC />} />
          <Route path={ROUTES.SCRIPT} element={<Script />} />
          <Route path={ROUTES.VIDEOS} element={<AgencyPocVideos />} />
          <Route path={ROUTES.NOCIFICATIONS} element={<Notifications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
