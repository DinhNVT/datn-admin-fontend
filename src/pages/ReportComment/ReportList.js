import React, { useEffect, useState } from "react";
import "./ReportList.scss";
import { Breadcrumb, Table } from "antd";
import { getCreatedAtString } from "../../utils/convertTime";
import { TbEye, TbSquareRoundedCheck, TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { HOME_PATH } from "../../routes/routers.constant";
import { truncateTitle } from "../../utils/truncateString";
import { confirmAlert } from "../../utils/customAlert";
import { MdOutlineClose } from "react-icons/md";
import {
  apiDeleteMultipleReportComments,
  apiGetAllReportComments,
  apiResolveMultipleReportComments,
} from "../../apis/reportComment";
import ReportCommentView from "./ReportCommentView/ReportCommentView";

const ReportList = () => {
  const [reportComments, setReportComments] = useState([]);
  const [reportComment, setReportComment] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);

  const getAllReportComments = async () => {
    try {
      const res = await apiGetAllReportComments();
      if (res.data.reportComments.length >= 0) {
        const modifiedReportComments = res.data.reportComments.map(
          (reportComment) => {
            return { ...reportComment, key: reportComment._id };
          }
        );
        setReportComments(modifiedReportComments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllReportComments();
  }, []);

  const handleSearch = () => {
    const filteredReportComments = reportComments.filter((reportComment) => {
      const commentMatch = reportComment.comment
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const nameMatch = reportComment?.userId.name
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const titleMatch = reportComment?.postId.title
        .toLowerCase()
        .includes(keyword.toLowerCase());
      return commentMatch || nameMatch || titleMatch;
    });

    return filteredReportComments;
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
    const reportCommentFind = reportComments.find(
      (reportComment) => reportComment._id === id
    );
    setReportComment(reportCommentFind);
    setIsShowModal(true);
  };

  const handleResolveReportComment = async (id, status) => {
    const confirmResolveReportComment = () => {
      return apiResolveMultipleReportComments({ reportIds: id });
    };

    const confirmSuccess = () => {
      getAllReportComments();
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmFail = () => {};

    confirmAlert(
      `${
        status === "one"
          ? "Giải quyết bình luận xấu này"
          : "Giải quyết tất cả bình luận xấu"
      }`,
      "",
      `${status === "one" ? "Giải quyết" : "Giải quyết tất cả"}`,
      "#00c491",
      confirmResolveReportComment,
      confirmSuccess,
      confirmFail,
      {
        title: `${
          status === "one"
            ? "Giải quyết thành công"
            : "Đã giải quyết tất cả tất cả bình luận"
        }`,
        text: `${
          status === "one"
            ? "Bình luận xấu đã được xóa"
            : "Các bình luận xấu đã được xóa"
        }`,
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const handleDeleteReportComment = async (id, status) => {
    const confirmDelete = () => {
      return apiDeleteMultipleReportComments({ reportIds: id });
    };

    const confirmDeleteSuccess = () => {
      getAllReportComments();
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmDeleteFail = () => {};

    confirmAlert(
      `${status === "one" ? "Xóa báo cáo này" : "Xóa tất cả báo cáo"}`,
      "",
      `${status === "one" ? "Xóa" : "Xóa tất cả"}`,
      "#f97066",
      confirmDelete,
      confirmDeleteSuccess,
      confirmDeleteFail,
      {
        title: `${
          status === "one" ? "Xóa thành công" : "Đã xóa tất cả báo cáo"
        }`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const columns = [
    {
      title: "Người bình luận",
      dataIndex: "userId",
      sorter: (a, b) => a.userId.name.localeCompare(b.userId.name),
      render: (userId) => <span>{truncateTitle(userId.name, 24)}</span>,
    },
    {
      title: "Bài viết",
      dataIndex: "postId",
      sorter: (a, b) => a.postId.title.localeCompare(b.email),
      render: (postId) => (
        <span className="content">{truncateTitle(postId.title, 200)}</span>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      sorter: (a, b) => a.comment.localeCompare(b.content),
      render: (comment) => (
        <span className={"content"}>{truncateTitle(comment, 130)}</span>
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
                handleResolveReportComment([_id], "one");
              }}
              className="icon icon-resolve"
            />
          )}
          <TbTrash
            onClick={() => {
              handleDeleteReportComment([_id], "one");
            }}
            className="icon icon-delete"
          />
        </div>
      ),
    },
  ];
  return (
    <div className="report-list-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Danh sách bình luận xấu</h1>
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
                  title: "Bình luận xấu",
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
                placeholder="Tìm kiếm bình luận xấu..."
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
      {reportComments.length >= 0 && (
        <div className="table">
          {selectedRowKeys.length > 0 && (
            <div className="btn-list-action">
              <button
                onClick={() => {
                  handleDeleteReportComment(selectedRowKeys, "many");
                }}
                className="btn btn-delete-all"
              >
                {"Xóa tất cả báo cáo"}
              </button>
              <button
                onClick={() => {
                  handleResolveReportComment(selectedRowKeys, "many");
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
          />
        </div>
      )}
      <ReportCommentView
        reportComment={reportComment}
        isShowModal={isShowModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default ReportList;
