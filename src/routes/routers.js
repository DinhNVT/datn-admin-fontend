import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRouters from "./AuthRouters";
import {
  ACCOUNT_PATH,
  CATEGORY_PATH,
  HOME_PATH,
  LOGIN_PATH,
} from "./routers.constant";
import Login from "../pages/Login/Login";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import Dashboard from "../pages/Dashboard/Dashboard";
import AccountList from "../pages/Account/AccountList/AccountList";
import NotFoundPage from "../pages/404/NotFoundPage";
import CategoryList from "../pages/Category/CategoryList/CategoryList";

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
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route
          path={ACCOUNT_PATH.LIST}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <AccountList />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route
          path={CATEGORY_PATH.LIST}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <CategoryList />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route path={"*"} exact element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;
