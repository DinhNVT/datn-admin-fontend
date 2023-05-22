import React from "react";
import "./SideBar.scss";
import logoHorizontal from "../../assets/images/LogoHorizontal.png";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";

const SideBar = () => {
  const location = useLocation();
  return (
    <div className="side-bar-container">
      <div className="side-bar-content">
        <img className="logo" src={logoHorizontal} alt="" />
        <ul className="ul-menu">
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to={"/"}>
              <RxDashboard className={"icon"} /> Dashboard
            </Link>
          </li>
          <li
            className={location.pathname.includes("/write") ? "active" : ""}
          >
            <Link to={"/write"}>
              <FiEdit className={"icon"}/> Bài viết
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
