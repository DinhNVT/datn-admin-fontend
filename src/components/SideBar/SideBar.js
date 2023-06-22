import React from "react";
import "./SideBar.scss";
import logoHorizontal from "../../assets/images/LogoHorizontal.png";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { AiOutlineContacts } from "react-icons/ai";
import { GoReport } from "react-icons/go";
import { RxVideo } from "react-icons/rx";
import {
  ACCOUNT_PATH,
  CATEGORY_PATH,
  CONTACT_PATH,
  POST_PATH,
  REPORT_COMMENT_PATH,
  VIDEO_YOUTUBE_PATH,
} from "../../routes/routers.constant";
import { useSelector } from "react-redux";
import circleLogo from "../../assets/images/circle_logo.png";

const SideBar = () => {
  const location = useLocation();
  const { status } = useSelector((state) => state?.scale_sidebar);

  return (
    <div className={`side-bar-container ${status ? "small" : "large"}`}>
      <div className={`side-bar-content ${status ? "small" : "large"}`}>
        {status ? (
          <img className="logo-circle" src={circleLogo} alt="" />
        ) : (
          <img className="logo" src={logoHorizontal} alt="" />
        )}
        <ul className="ul-menu">
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link className={`${status ? "small" : ""}`} to={"/"}>
              <RxDashboard className={`icon ${status ? "small" : "large"}`} />{" "}
              {status ? (
                <span className="hover-icon">Dashboard</span>
              ) : (
                "Dashboard"
              )}
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(ACCOUNT_PATH.LIST) ? "active" : ""
            }
          >
            <Link className={`${status ? "small" : ""}`} to={ACCOUNT_PATH.LIST}>
              <HiOutlineUsers
                className={`icon ${status ? "small" : "large"}`}
              />
              {status ? (
                <span className="hover-icon">Tài khoản</span>
              ) : (
                "Tài khoản"
              )}
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(CATEGORY_PATH.LIST) ? "active" : ""
            }
          >
            <Link
              className={`${status ? "small" : ""}`}
              to={CATEGORY_PATH.LIST}
            >
              <MdOutlineCategory
                className={`icon ${status ? "small" : "large"}`}
              />
              {status ? (
                <span className="hover-icon">Danh mục</span>
              ) : (
                "Danh mục"
              )}
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(POST_PATH.LIST) ? "active" : ""
            }
          >
            <Link className={`${status ? "small" : ""}`} to={POST_PATH.LIST}>
              <FiEdit className={`icon ${status ? "small" : "large"}`} />{" "}
              {status ? (
                <span className="hover-icon">Bài viết</span>
              ) : (
                "Bài viết"
              )}
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(REPORT_COMMENT_PATH.LIST)
                ? "active"
                : ""
            }
          >
            <Link
              className={`${status ? "small" : ""}`}
              to={REPORT_COMMENT_PATH.LIST}
            >
              <GoReport className={`icon ${status ? "small" : "large"}`} />{" "}
              {status ? (
                <span className="hover-icon">Bình luận xấu</span>
              ) : (
                "Bình luận xấu"
              )}
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(CONTACT_PATH.LIST) ? "active" : ""
            }
          >
            <Link className={`${status ? "small" : ""}`} to={CONTACT_PATH.LIST}>
              <AiOutlineContacts
                className={`icon ${status ? "small" : "large"}`}
              />
              {status ? <span className="hover-icon">Liên hệ</span> : "Liên hệ"}
            </Link>
          </li>
          <li
            className={
              location.pathname.includes(VIDEO_YOUTUBE_PATH.LIST)
                ? "active"
                : ""
            }
          >
            <Link
              className={`${status ? "small" : ""}`}
              to={VIDEO_YOUTUBE_PATH.LIST}
            >
              <RxVideo
                className={`icon ${status ? "small" : "large"}`}
              />
              {status ? (
                <span className="hover-icon">Video Youtube</span>
              ) : (
                "Video Youtube"
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
