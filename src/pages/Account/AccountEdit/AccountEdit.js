import React, { useEffect, useState } from "react";
import "./AccountEdit.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ACCOUNT_PATH, HOME_PATH } from "../../../routes/routers.constant";
import { Breadcrumb } from "antd";
import { RxDashboard } from "react-icons/rx";
import { TbPhotoEdit } from "react-icons/tb";
import Modal from "../../../components/Modal/Modal";
import ChangeAvatar from "./ChangeAvatar/ChangeAvatar";
import ChangeSocial from "./ChangeSocial/ChangeSocial";
import FullName from "./FullName/FullName";
import { apiGetUserById } from "../../../apis/user";
import avtDefault from "../../../assets/images/avatar_default.png";
import facebookIcon from "../../../assets/images/facebook.png";
import instagramIcon from "../../../assets/images/instagram.png";
import youtubeIcon from "../../../assets/images/youtube.png";
import tiktokIcon from "../../../assets/images/tiktok.png";
import { useDispatch, useSelector } from "react-redux";
import { refreshUserFetch } from "../../../stores/apiAuthRequest";

const AccountEdit = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [isFetchUser, setIsFetchUser] = useState(true);

  const [isShowModal, setIsShowModal] = useState("");
  const closeModal = () => {
    setIsShowModal("");
  };

  const userStore = useSelector((state) => state?.auth?.login);
  const dispatch = useDispatch();

  const getUserByUserId = async (id) => {
    try {
      setUserLoading(true);
      const res = await apiGetUserById(id);
      if (res.data.user) {
        setUser(res.data.user);
        if (userStore?.user?._id === res.data.user?._id) {
          refreshUserFetch(dispatch);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUserLoading(false);
      setIsFetchUser(false);
    }
  };

  useEffect(() => {
    getUserByUserId(params.id);
    // eslint-disable-next-line
  }, [params.id]);
  return (
    <div className="account-edit-container">
      <div className="header">
        <div className="header-content">
          <div className="title">
            <h1>Chỉnh sửa tài khoản</h1>
            <Breadcrumb
              items={[
                {
                  to: HOME_PATH,
                  title: (
                    <Link to={HOME_PATH}>
                      <RxDashboard className="icon-bread-crumb" />
                    </Link>
                  ),
                },
                {
                  to: ACCOUNT_PATH.LIST,
                  title: (
                    <Link to={ACCOUNT_PATH.LIST}>
                      <span>Danh sách tài khoản</span>
                    </Link>
                  ),
                },
                {
                  title: "Chỉnh sửa",
                },
              ]}
            />
          </div>
          <div className="right">
            <button
              onClick={() => {
                navigate(ACCOUNT_PATH.LIST);
              }}
              className="btn-add-user"
            >
              Xem danh sách tài khoản
            </button>
          </div>
        </div>
      </div>
      <div className="edit-content">
        <h1 className="title">Chỉnh sửa thông tin cá nhân</h1>
        {user && !isFetchUser && (
          <div className="edit-profile-content grid-container">
            <div
              onClick={() => {
                setIsShowModal("avatar");
              }}
              className="avt-img"
            >
              <img
                className="img"
                src={user?.avatar ? user?.avatar : avtDefault}
                alt=""
              />
              <TbPhotoEdit className={"edit-icon"} />
            </div>
            <div className="info-list">
              <div className="info-item disable">
                <h4>Email</h4>
                <p>{user?.email}</p>
              </div>
              <div
                onClick={() => {
                  setIsShowModal("name");
                }}
                className="info-item"
              >
                <h4>Họ tên</h4>
                <p>{user?.name}</p>
              </div>
              <div
                onClick={() => {
                  setIsShowModal("username");
                }}
                className="info-item"
              >
                <h4>Username</h4>
                <p>{user?.username}</p>
              </div>
              <div
                onClick={() => {
                  setIsShowModal("bio");
                }}
                className="info-item"
              >
                <h4>Nghề nghiệp</h4>
                <p>{user?.bio}</p>
              </div>
              <div
                onClick={() => {
                  setIsShowModal("social");
                }}
                className="info-item"
              >
                <h4>Mạng xã hội</h4>
                <div className="icon-list">
                  {user?.social.facebook && <img src={facebookIcon} alt="" />}
                  {user?.social.instagram && <img src={instagramIcon} alt="" />}
                  {user?.social.youtube && <img src={youtubeIcon} alt="" />}
                  {user?.social.tiktok && <img src={tiktokIcon} alt="" />}
                  {!user?.social.facebook &&
                    !user?.social.instagram &&
                    !user?.social.youtube &&
                    !user?.social.tiktok && <p>Không có mạng xã hội</p>}
                </div>
              </div>
            </div>
          </div>
        )}
        {!user && !isFetchUser && (
          <p className="not-found-text">Không có tài khoản này</p>
        )}
        {(userLoading || isFetchUser) && (
          <div className="edit-profile-content grid-container">
            <div className="avt-img">
              <div className="img img-skeleton skeleton"></div>
            </div>
            <div className="info-list">
              <div className="info-item-skeleton skeleton "></div>
              <div className="info-item-skeleton skeleton "></div>
              <div className="info-item-skeleton skeleton "></div>
              <div className="info-item-skeleton skeleton "></div>
              <div className="info-item-skeleton skeleton "></div>
            </div>
          </div>
        )}
        {(isShowModal === "name" ||
          isShowModal === "username" ||
          isShowModal === "bio") && (
          <Modal closeModal={closeModal}>
            <FullName
              status={isShowModal}
              closeModal={closeModal}
              user={user}
              getUserByUserId={getUserByUserId}
            />
          </Modal>
        )}
        {isShowModal === "social" && (
          <Modal closeModal={closeModal}>
            <ChangeSocial
              user={user}
              getUserByUserId={getUserByUserId}
              closeModal={closeModal}
            />
          </Modal>
        )}
        {isShowModal === "avatar" && (
          <Modal closeModal={closeModal}>
            <ChangeAvatar
              user={user}
              getUserByUserId={getUserByUserId}
              closeModal={closeModal}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AccountEdit;
