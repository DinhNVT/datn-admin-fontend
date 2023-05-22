import React from "react";
import "./MainLayout.scss";
import SideBar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";

const MainLayout = (props) => {
  return (
    <div className="main-layout-container">
      <SideBar />
      <Header />
      <div className="main-layout-children">{props.children}</div>
    </div>
  );
};

export default MainLayout;
