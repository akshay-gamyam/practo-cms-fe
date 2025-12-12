import React, { useEffect, useState } from "react";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import BackgrounImage from "../../assets/HomeBackground.jpg";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/RouterConstant";

const AuthLayout = () => {
  const location = useLocation();
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    if (location.pathname === ROUTES.LOGIN) setScreen("login");
    if (location.pathname === ROUTES.FORGOT) setScreen("forgot");
  }, [location.pathname]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 ">
        <img
          src={BackgrounImage}
          alt="Medical Background"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 backdrop-blur-[2px]"></div> */}
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative min-h-[500px]">
          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              screen === "login"
                ? "translate-x-0 opacity-100 pointer-events-auto z-20"
                : "-translate-x-full opacity-0 pointer-events-none z-10"
            }`}
          >
            <Login setScreen={setScreen} />
          </div>

          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              screen === "forgot"
                ? "translate-x-0 opacity-100 pointer-events-auto z-20"
                : "translate-x-full opacity-0 pointer-events-none z-10"
            }`}
          >
            <ForgotPassword setScreen={setScreen} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
