import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRouters from "./AuthRouters";
import {
  ACCOUNT_PATH,
  CATEGORY_PATH,
  CONTACT_PATH,
  HOME_PATH,
  LOGIN_PATH,
  POST_PATH,
  REPORT_COMMENT_PATH,
} from "./routers.constant";
import Login from "../pages/Login/Login";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import Dashboard from "../pages/Dashboard/Dashboard";
import AccountList from "../pages/Account/AccountList/AccountList";
import NotFoundPage from "../pages/404/NotFoundPage";
import CategoryList from "../pages/Category/CategoryList/CategoryList";
import AccountEdit from "../pages/Account/AccountEdit/AccountEdit";
import PostList from "../pages/Post/PostList/PostList";
import WritePost from "../pages/Post/WritePost/WritePost";
import EditPost from "../pages/Post/EditPost/EditPost";
import ViewPost from "../pages/Post/ViewPost/ViewPost";
import ContactList from "../pages/Contact/ContactList";
import ReportList from "../pages/ReportComment/ReportList";

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
          path={ACCOUNT_PATH.EDIT}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <AccountEdit />
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
        <Route
          path={POST_PATH.LIST}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <PostList />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route
          path={POST_PATH.WRITE}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <WritePost />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route
          path={POST_PATH.EDIT}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <EditPost />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route
          path={POST_PATH.VIEW}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <ViewPost />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route
          path={REPORT_COMMENT_PATH.LIST}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <ReportList />
              </MainLayout>
            </AuthenticatedRoutes>
          }
        />
        <Route
          path={CONTACT_PATH.LIST}
          exact
          element={
            <AuthenticatedRoutes>
              <MainLayout>
                <ContactList />
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
