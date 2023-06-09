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
import { getCreatedAtString } from "../../../utils/convertTime";
import { RiAddFill } from "react-icons/ri";
import { TbEdit, TbDotsVertical } from "react-icons/tb";
import AddUserForm from "../AddUserForm/AddUserForm";
import { Link, useNavigate } from "react-router-dom";
import { ACCOUNT_PATH, HOME_PATH } from "../../../routes/routers.constant";
import { RxDashboard } from "react-icons/rx";
import { confirmAlert, errorAlert } from "../../../utils/customAlert";
import { useSelector } from "react-redux";
import { MdOutlineClose } from "react-icons/md";

const AccountList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [showDropdownUserId, setShowDropdownUserId] = useState("");
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const { user } = useSelector((state) => state?.auth?.login);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiGetAllUsers();
      if (res.data.users.length >= 0) {
        const modifiedUsers = res.data.users.map((user) => {
          return { ...user, key: user?._id };
        });
        setUsers(modifiedUsers);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearch = () => {
    const filteredAccounts = users.filter((user) => {
      const nameMatch = user?.name.toLowerCase().includes(keyword.toLowerCase());
      const emailMatch = user?.email
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
      disabled: record._id === user?._id,
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
    if (user?._id === id) {
      errorAlert("Đã xảy ra lỗi", "Bạn không được chặn chính bạn");
      setIsShowDropDown(false);
      return;
    }
    if (status === "unblock") {
      const confirmChangRole = () => {
        return apiUnBlockUser(id);
      };

      const confirmChangRoleSuccess = () => {
        getAllUsers();
        setIsShowDropDown(false);
      };

      const confirmChangRoleFail = () => {};

      confirmAlert(
        "Bạn có muốn bỏ chặn không",
        "",
        "Bỏ chặn",
        "#00c491",
        confirmChangRole,
        confirmChangRoleSuccess,
        confirmChangRoleFail,
        {
          title: "Bỏ chặn thành công",
          text: "",
          timer: 1500,
          isShowConfirmButton: false,
        }
      );
    } else if (status === "block") {
      const confirmChangRole = () => {
        return apiBlockUser(id);
      };

      const confirmChangRoleSuccess = () => {
        getAllUsers();
        setIsShowDropDown(false);
      };

      const confirmChangRoleFail = () => {};

      confirmAlert(
        "Bạn có muốn chặn không",
        "",
        "Chặn",
        "#f97066",
        confirmChangRole,
        confirmChangRoleSuccess,
        confirmChangRoleFail,
        {
          title: "Chặn thành công",
          text: "",
          timer: 1500,
          isShowConfirmButton: false,
        }
      );
    }
  };

  const handleChangeRoleUser = async (role, id) => {
    if (user?._id === id) {
      errorAlert("Đã xảy ra lỗi", "Bạn không được đổi quyền chính bạn");
      setIsShowDropDown(false);
      return;
    }

    const confirmChangRole = () => {
      return apiChangeRoleUser(id, { role: role });
    };

    const confirmChangRoleSuccess = () => {
      getAllUsers();
      setIsShowDropDown(false);
    };

    const confirmChangRoleFail = () => {};

    confirmAlert(
      "Bạn có muốn đổi quyền không",
      "",
      "Đổi quyền",
      "#00c491",
      confirmChangRole,
      confirmChangRoleSuccess,
      confirmChangRoleFail,
      {
        title: "Đổi quyền thành công",
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const handleChangeRolesUser = async (role) => {
    const confirmChangRole = () => {
      return apiChangeRolesUser({
        userIds: selectedRowKeys,
        role: role,
      });
    };

    const confirmChangRoleSuccess = () => {
      getAllUsers();
      setSelectedRowKeys([]);
    };

    const confirmChangRoleFail = () => {};

    confirmAlert(
      `Đổi quyền thành ${role}`,
      "Bạn có muốn đổi quyền tất cả không",
      "Đổi quyền",
      "#00c491",
      confirmChangRole,
      confirmChangRoleSuccess,
      confirmChangRoleFail,
      {
        title: "Đổi quyền thành công",
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const handleBlockAndUnblockUsers = async (block) => {
    const confirmChangRole = () => {
      return apiBlockAndUnBlockUsers({
        userIds: selectedRowKeys,
        block: block,
      });
    };

    const confirmChangRoleSuccess = () => {
      getAllUsers();
      setSelectedRowKeys([]);
    };

    const confirmChangRoleFail = () => {};

    confirmAlert(
      `${
        block === true ? "Chặn tất cả người dùng" : "Bỏ chặn tất cả người dùng"
      }`,
      "",
      `${block === true ? "Chặn tất cả" : "Bỏ chặn tất cả"}`,
      `${block === true ? "#f97066" : "#00c491"}`,
      confirmChangRole,
      confirmChangRoleSuccess,
      confirmChangRoleFail,
      {
        title: `${block === true ? "Đã chặn tất cả" : "Đã bỏ chặn tất cả"}`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
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
                    {record.isBlocked === true ? "Bỏ chặn" : "Chặn tài khoản"}
                  </li>
                  <li
                    onClick={() => {
                      const role =
                        record.roleId.name === "admin" ? "user" : "admin";
                      handleChangeRoleUser(role, _id);
                    }}
                  >
                    {"Đổi quyền"}
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
              {!!keyword && (
                <MdOutlineClose
                  onClick={() => {
                    setKeyword("");
                  }}
                  className={"icon-search"}
                />
              )}
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
      {users.length >= 0 && (
        <div className="table">
          {selectedRowKeys.length > 0 && (
            <div className="btn-list-action">
              <button
                onClick={() => {
                  handleBlockAndUnblockUsers(true);
                }}
                className="btn btn-block-all"
              >
                {"Chặn tất cả"}
              </button>
              <button
                onClick={() => {
                  handleBlockAndUnblockUsers(false);
                }}
                className="btn btn-unblock-all"
              >
                {"Bỏ chặn tất cả"}
              </button>
              <button
                onClick={() => {
                  handleChangeRolesUser("admin");
                }}
                className="btn btn-replace-role-all"
              >
                {"Đổi quyền thành admin"}
              </button>
              <button
                onClick={() => {
                  handleChangeRolesUser("user");
                }}
                className="btn btn-replace-role-all"
              >
                {"Đổi quyền thành user"}
              </button>
            </div>
          )}

          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            loading={isLoading}
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
