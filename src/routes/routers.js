import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRouters from "./AuthRouters";
import { HOME_PATH, LOGIN_PATH } from "./routers.constant";
import Login from "../pages/Login/Login";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthenticatedRoutes from "./AuthenticatedRoutes";

function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path={LOGIN_PATH}
          element={
            <AuthRouters>
              <Login />
            </AuthRouters>
          }
        />

        <Route
          path={HOME_PATH}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout />
            </AuthenticatedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;
