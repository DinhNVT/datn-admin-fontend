import React, { useEffect, useRef, useState } from "react";
import "./AccountList.scss";
import { Breadcrumb, Table } from "antd";
import {
  apiBlockAndUnBlockUsers,
  apiBlockUser,
  apiChangeRoleUser,
  apiChangeRolesUser,
  apiGetAllUsers,
  apiUnBlockUser,
} from "../../../apis/user";
import avtDefault from "../../../assets/images/avatar_default.png";
import { getCreatedAtString } from "../../../utils/convertTime copy";
import { RiAddFill } from "react-icons/ri";
import { TbEdit, TbDotsVertical } from "react-icons/tb";
import AddUserForm from "../AddUserForm/AddUserForm";
import { Link, useNavigate } from "react-router-dom";
import { ACCOUNT_PATH, HOME_PATH } from "../../../routes/routers.constant";
import { RxDashboard } from "react-icons/rx";
import { errorAlert, successAlert } from "../../../utils/customAlert";
import Loader2 from "../../../components/Loader2/Loader2";
import { useSelector } from "react-redux";

const AccountList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [showDropdownUserId, setShowDropdownUserId] = useState("");
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropDown(false);
        setShowDropdownUserId("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const [isLoadingBlock, setIsLoadingBlock] = useState(false);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState("");
  const [isLoadingChangeRole, setIsLoadingChangeRole] = useState(false);
  const [isLoadingChangeRoles, setIsLoadingChangeRoles] = useState("");

  const { user } = useSelector((state) => state?.auth?.login);

  const getAllUsers = async () => {
    try {
      const res = await apiGetAllUsers();
      if (res.data.users.length > 0) {
        const modifiedUsers = res.data.users.map((user) => {
          return { ...user, key: user._id };
        });
        setUsers(modifiedUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearch = () => {
    const filteredAccounts = users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(keyword.toLowerCase());
      const emailMatch = user.email
        .toLowerCase()
        .includes(keyword.toLowerCase());
      return nameMatch || emailMatch;
    });

    return filteredAccounts;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record._id === user._id,
      _id: record._id,
    }),
  };

  const closeModal = () => {
    setIsShowModalAdd(false);
  };

  const openModal = () => {
    setIsShowModalAdd(true);
  };

  const handleOnClickEdit = (id) => {
    navigate(ACCOUNT_PATH.EDIT.replace(":id", id));
  };

  const handleBlockUser = async (status, id) => {
    setIsLoadingBlock(true);
    if (user._id === id) {
      errorAlert("Đã xảy ra lỗi", "Bạn không được chặn chính bạn");
      setIsLoadingBlock(false);
      setIsShowDropDown(false);
      return;
    }
    if (status === "unblock") {
      try {
        await apiUnBlockUser(id);
        getAllUsers();
        successAlert("Đã bỏ chặn");
        setIsLoadingBlock(false);
        setIsShowDropDown(false);
      } catch (error) {
        errorAlert("Đã xảy ra lỗi", error?.response?.data?.message);
        setIsLoadingBlock(false);
      }
    } else if (status === "block") {
      try {
        await apiBlockUser(id);
        getAllUsers();
        successAlert("Đã chặn");
        setIsLoadingBlock(false);
        setIsShowDropDown(false);
      } catch (error) {
        errorAlert("Đã xảy ra lỗi", error?.response?.data?.message);
        setIsLoadingBlock(false);
      }
    }
  };

  const handleChangeRoleUser = async (role, id) => {
    setIsLoadingChangeRole(true);
    if (user._id === id) {
      errorAlert("Đã xảy ra lỗi", "Bạn không được đổi quyền chính bạn");
      setIsLoadingChangeRole(false);
      setIsShowDropDown(false);
      return;
    }
    try {
      await apiChangeRoleUser(id, { role: role });
      getAllUsers();
      successAlert("Đã đổi quyền");
      setIsLoadingChangeRole(false);
      setIsShowDropDown(false);
    } catch (error) {
      errorAlert("Đã xảy ra lỗi", error?.response?.data?.message);
      setIsLoadingChangeRole(false);
      console.log(error);
    }
  };

  const handleChangeRolesUser = async (role) => {
    setIsLoadingChangeRoles(role);
    try {
      await apiChangeRolesUser({
        userIds: selectedRowKeys,
        role: role,
      });
      getAllUsers();
      successAlert("Đã đổi quyền");
      setIsLoadingChangeRoles("");
      setSelectedRowKeys([]);
    } catch (error) {
      errorAlert("Đã xảy ra lỗi", error?.response?.data?.message);
      setIsLoadingChangeRoles("");
      console.log(error);
    }
  };

  const handleBlockAndUnblockUsers = async (block) => {
    setIsLoadingBlocks(block);
    try {
      await apiBlockAndUnBlockUsers({
        userIds: selectedRowKeys,
        block: block,
      });
      getAllUsers();
      if (block === true) successAlert("Đã chặn tất cả");
      else if (block === false) successAlert("Đã bỏ chặn tất cả");
      setIsLoadingBlocks("");
      setSelectedRowKeys([]);
    } catch (error) {
      errorAlert("Đã xảy ra lỗi", error?.response?.data?.message);
      setIsLoadingBlocks("");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div className="avt-name">
          <img
            className="avt"
            src={!!record.avatar ? record.avatar : avtDefault}
            alt=""
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Nghề nghiệp",
      dataIndex: "bio",
      sorter: (a, b) => a.bio.localeCompare(b.bio),
    },
    {
      title: "Trạng thái",
      dataIndex: "isVerify",
      filters: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Blocked",
          value: "Blocked",
        },
        {
          text: "Not Verify",
          value: "Not Verify",
        },
      ],
      onFilter: (value, record) => {
        const status = record.isBlocked
          ? "Blocked"
          : record.isVerify
          ? "Active"
          : "Not Verify";
        return status === value;
      },
      render: (isVerify, record) => (
        <span
          className={`tag ${
            record?.isBlocked ? "blocked" : isVerify ? "active" : "not-verify"
          }`}
        >
          {record?.isBlocked ? "Blocked" : isVerify ? "Active" : "Not Verify"}
        </span>
      ),
    },
    {
      title: "Quyền",
      dataIndex: "roleId",
      filters: [
        {
          text: "Admin",
          value: "admin",
        },
        {
          text: "User",
          value: "user",
        },
      ],
      onFilter: (value, record) => record.roleId.name.indexOf(value) === 0,
      render: (roleId) => (
        <span className={`tag ${roleId.name === "admin" ? "active" : "user"}`}>
          {roleId.name.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (createdAt) => <span>{getCreatedAtString(createdAt)}</span>,
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (_id, record) => (
        <div className="action-list">
          {/* <TbEye className="icon icon-view" /> */}
          <TbEdit
            onClick={() => {
              handleOnClickEdit(_id);
            }}
            className="icon icon-edit"
          />
          <div
            ref={showDropdownUserId === _id ? dropdownRef : null}
            className="action-dropdown"
          >
            <TbDotsVertical
              onClick={() => {
                setShowDropdownUserId(_id);
                setIsShowDropDown(!isShowDropDown);
              }}
              className="icon icon-dot"
            />
            {isShowDropDown && showDropdownUserId === _id && (
              <div className="dropdown">
                <ul>
                  <li
                    onClick={() => {
                      const status =
                        record.isBlocked === true ? "unblock" : "block";
                      handleBlockUser(status, _id);
                    }}
                  >
                    {isLoadingBlock ? (
                      <Loader2 />
                    ) : record.isBlocked === true ? (
                      "Mở chặn"
                    ) : (
                      "Chặn tài khoản"
                    )}
                  </li>
                  <li
                    onClick={() => {
                      const role =
                        record.roleId.name === "admin" ? "user" : "admin";
                      handleChangeRoleUser(role, _id);
                    }}
                  >
                    {isLoadingChangeRole ? <Loader2 /> : "Đổi quyền"}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="account-list-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Danh sách tài khoản</h1>
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
                  title: "Danh sách tài khoản",
                },
              ]}
            />
          </div>

          <div className="right">
            <div className="search">
              <input
                size="40"
                className="input-search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                name="search"
                placeholder="Tìm kiếm tài khoản..."
                autoComplete="off"
                required
              />
            </div>
            <button onClick={openModal} className="btn-add-user">
              <RiAddFill className={"icon"} /> Thêm user
            </button>
            <AddUserForm
              isShowModal={isShowModalAdd}
              closeModal={closeModal}
              getAllUsers={getAllUsers}
            />
          </div>
        </div>
      </div>
      {users.length > 0 && (
        <div className="table">
          {selectedRowKeys.length > 0 && (
            <div className="btn-list-action">
              <button
                onClick={() => {
                  handleBlockAndUnblockUsers(true);
                }}
                className="btn"
              >
                {isLoadingBlocks === true ? <Loader2 /> : "Chặn tất cả"}
              </button>
              <button
                onClick={() => {
                  handleBlockAndUnblockUsers(false);
                }}
                className="btn"
              >
                {isLoadingBlocks === false ? <Loader2 /> : "Bỏ chặn tất cả"}
              </button>
              <button
                onClick={() => {
                  handleChangeRolesUser("admin");
                }}
                className="btn"
              >
                {isLoadingChangeRoles === "admin" ? (
                  <Loader2 />
                ) : (
                  "Đổi quyền thành admin"
                )}
              </button>
              <button
                onClick={() => {
                  handleChangeRolesUser("user");
                }}
                className="btn"
              >
                {isLoadingChangeRoles === "user" ? (
                  <Loader2 />
                ) : (
                  "Đổi quyền thành user"
                )}
              </button>
            </div>
          )}

          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            dataSource={handleSearch()}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AccountList;
