import React, { useEffect, useState } from "react";
import "./AccountList.scss";
import { Table } from "antd";
import { apiGetAllUsers } from "../../../apis/user";
import avtDefault from "../../../assets/images/avatar_default.png";
import { getCreatedAtString } from "../../../utils/convertTime copy";
import { RiAddFill } from "react-icons/ri";
import { TbEdit, TbEye, TbDotsVertical } from "react-icons/tb";

const AccountList = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
      console.log(error.message);
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
    },
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
        const status = record.isVerify
          ? "Active"
          : record.isBlocked
          ? "Blocked"
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
      title: "Hành động",
      dataIndex: "_id",
      render: (_id) => (
        <div className="action-list">
          <TbEye className="icon icon-view" />
          <TbEdit className="icon icon-edit" />
          <TbDotsVertical className="icon icon-dot" />
        </div>
      ),
    },
  ];
  return (
    <div className="account-list-container">
      <div className="header">
        <div className="header-content">
          <h1>Tài khoản</h1>
          <div className="right">
            <div className="search">
              <input
                size="40"
                className="input-search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                name="search"
                placeholder="Tìm kiếm..."
                autoComplete="off"
                required
              />
            </div>
            <button className="btn-add-user">
              <RiAddFill className={"icon"} /> Thêm user
            </button>
          </div>
        </div>
      </div>
      {users.length > 0 && (
        <div className="table">
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
