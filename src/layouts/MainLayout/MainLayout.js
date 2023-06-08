import React from "react";
import "./MainLayout.scss";
import SideBar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";

const MainLayout = (props) => {
  const { status } = useSelector((state) => state?.scale_sidebar);

  return (
    <div className="main-layout-container">
      <SideBar />
      <Header />
      <div className={`main-layout-children ${status ? "small" : "large"}`}>
        {props.children}
      </div>
    </div>
  );
};

export default MainLayout;
