import React, { useEffect, useState } from "react";
import "./ContactList.scss";
import { Breadcrumb, Table } from "antd";
import { getCreatedAtString } from "../../utils/convertTime";
import { TbEye, TbSquareRoundedCheck, TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import {
  apiDeleteMultipleContacts,
  apiGetAllContacts,
  apiResolveMultipleContacts,
} from "../../apis/contact";
import { HOME_PATH } from "../../routes/routers.constant";
import { truncateTitle } from "../../utils/truncateString";
import ContactView from "./ContactView/ContactView";
import { confirmAlert } from "../../utils/customAlert";
import { MdOutlineClose } from "react-icons/md";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAllContacts = async () => {
    setIsLoading(true);
    try {
      const res = await apiGetAllContacts();
      if (res.data.contacts.length >= 0) {
        const modifiedContacts = res.data.contacts.map((contact) => {
          return { ...contact, key: contact._id };
        });
        setContacts(modifiedContacts);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  const handleSearch = () => {
    const filteredContacts = contacts.filter((contact) => {
      const fullNameMatch = contact.fullName
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const emailMatch = contact.email
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const contentMatch = contact.content
        .toLowerCase()
        .includes(keyword.toLowerCase());
      return fullNameMatch || emailMatch || contentMatch;
    });

    return filteredContacts;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.status === "resolved",
    // }),
  };

  const closeModal = () => {
    setIsShowModal(false);
  };

  const handleOnClickView = (id) => {
    const contactFind = contacts.find((contact) => contact._id === id);
    setContact(contactFind);
    setIsShowModal(true);
  };

  const handleResolveContact = async (id, status) => {
    const confirmResolveContact = () => {
      return apiResolveMultipleContacts({ contactIds: id });
    };

    const confirmResolveContactSuccess = () => {
      getAllContacts();
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmResolveContactFail = () => {};

    confirmAlert(
      `${
        status === "one" ? "Bạn đã giải quyết?" : "Bạn đã giải quyết tất cả?"
      }`,
      "",
      `${status === "one" ? "Giải quyết" : "Giải quyết tất cả"}`,
      "#00c491",
      confirmResolveContact,
      confirmResolveContactSuccess,
      confirmResolveContactFail,
      {
        title: `${
          status === "one"
            ? "Giải quyết thành công"
            : "Đã giải quyết tất cả tất cả liên hệ"
        }`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const handleDeleteContact = async (id, status) => {
    const confirmDeleteContact = () => {
      return apiDeleteMultipleContacts({ contactIds: id });
    };

    const confirmDeleteContactSuccess = () => {
      getAllContacts();
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmDeleteContactFail = () => {};

    confirmAlert(
      `${status === "one" ? "Xóa liên hệ" : "Xóa tất cả liên hệ"}`,
      "",
      `${status === "one" ? "Xóa" : "Xóa tất cả"}`,
      "#f97066",
      confirmDeleteContact,
      confirmDeleteContactSuccess,
      confirmDeleteContactFail,
      {
        title: `${
          status === "one" ? "Xóa thành công" : "Đã xóa tất cả liên hệ"
        }`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email) => <span>{truncateTitle(email, 24)}</span>,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      sorter: (a, b) => a.content.localeCompare(b.content),
      render: (content) => (
        <span className={"content"}>{truncateTitle(content, 130)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Chưa giải quyết",
          value: "pending",
        },
        {
          text: "Đã giải quyết",
          value: "resolved",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => (
        <span className={`tag ${status}`}>
          {status === "pending"
            ? "Chưa giải quyết"
            : status === "resolved"
            ? "Đã giải quyết"
            : ""}
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
          <TbEye
            onClick={() => {
              handleOnClickView(_id);
            }}
            className="icon icon-view"
          />
          {record.status === "pending" && (
            <TbSquareRoundedCheck
              onClick={() => {
                handleResolveContact([_id], "one");
              }}
              className="icon icon-resolve"
            />
          )}
          <TbTrash
            onClick={() => {
              handleDeleteContact([_id], "one");
            }}
            className="icon icon-delete"
          />
        </div>
      ),
    },
  ];
  return (
    <div className="contact-list-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Danh sách liên hệ</h1>
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
                  title: "Liên hệ",
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
                placeholder="Tìm kiếm liên hệ..."
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
          </div>
        </div>
      </div>
      {contacts.length >= 0 && (
        <div className="table">
          {selectedRowKeys.length > 0 && (
            <div className="btn-list-action">
              <button
                onClick={() => {
                  handleDeleteContact(selectedRowKeys, "many");
                }}
                className="btn btn-delete-all"
              >
                {"Xóa tất cả"}
              </button>
              <button
                onClick={() => {
                  handleResolveContact(selectedRowKeys, "many");
                }}
                className="btn btn-resolve-all"
              >
                {"Giải quyết tất cả"}
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
            loading={isLoading}
          />
        </div>
      )}
      <ContactView
        contact={contact}
        isShowModal={isShowModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default ContactList;
