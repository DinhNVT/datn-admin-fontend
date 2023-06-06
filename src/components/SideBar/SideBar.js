import React from "react";
import "./SideBar.scss";
import logoHorizontal from "../../assets/images/LogoHorizontal.png";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import {
  ACCOUNT_PATH,
  CATEGORY_PATH,
  POST_PATH,
} from "../../routes/routers.constant";

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
            className={
              location.pathname.includes(ACCOUNT_PATH.LIST) ? "active" : ""
            }
          >
            <Link to={ACCOUNT_PATH.LIST}>
              <HiOutlineUsers className={"icon"} /> Tài khoản
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(CATEGORY_PATH.LIST) ? "active" : ""
            }
          >
            <Link to={CATEGORY_PATH.LIST}>
              <MdOutlineCategory className={"icon"} /> Danh mục
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(POST_PATH.LIST) ? "active" : ""
            }
          >
            <Link to={POST_PATH.LIST}>
              <FiEdit className={"icon"} /> Bài viết
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
