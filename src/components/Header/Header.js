import React, { useState } from "react";
import "./Header.scss";
import avtDefault from "../../assets/images/avatar_default.png";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserFetch } from "../../stores/apiAuthRequest";
import Loader2 from "../Loader2/Loader2";
import { ACCOUNT_PATH } from "../../routes/routers.constant";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutLoading(true);
    logoutUserFetch(dispatch, navigate, setIsLogoutLoading);
  };

  const { user } = useSelector((state) => state?.auth?.login);

  return (
    <div className="header-container">
      <div className="header-content">
        <Link className="info-user">
          <div className="information">
            <h4>{user.name}</h4>
            <p>Admin</p>
          </div>
          <div className="avt">
            <img src={user?.avatar ? user?.avatar : avtDefault} alt="" />
          </div>
          <div className="dropdown-info">
            <ul>
              <li>
                <Link to={ACCOUNT_PATH.EDIT.replace(":id", user._id)}>
                  <FiUser className={"icon"} /> Hồ sơ
                </Link>
              </li>
              <li>
                <button
                  disabled={isLogoutLoading === true}
                  onClick={handleLogoutClick}
                >
                  {isLogoutLoading ? (
                    <Loader2 />
                  ) : (
                    <IoLogOutOutline className={"icon"} />
                  )}
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
