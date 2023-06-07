import React, { useEffect, useRef, useState } from "react";
import "./PostList.scss";
import { Breadcrumb, Table } from "antd";
import { getCreatedAtString } from "../../../utils/convertTime";
import { TbEye, TbEdit, TbDotsVertical } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { HOME_PATH, POST_PATH } from "../../../routes/routers.constant";
import { RxDashboard } from "react-icons/rx";
import { confirmAlert, errorAlert } from "../../../utils/customAlert";
import {
  apiBlockMultiplePosts,
  apiDeleteMultiplePosts,
  apiGetAllPostsByAdmin,
  apiUnBlockMultiplePosts,
} from "../../../apis/post";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [showDropdownPostId, setShowDropdownPostId] = useState("");
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropDown(false);
        setShowDropdownPostId("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getAllPosts = async () => {
    try {
      const res = await apiGetAllPostsByAdmin();
      if (res.data.posts.length >= 0) {
        const modifiedPosts = res.data.posts.map((post) => {
          return { ...post, key: post._id };
        });
        setPosts(modifiedPosts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const handleSearch = () => {
    const filteredPosts = posts.filter((post) => {
      const titleMatch = post.title
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const slugMatch = post.slug.toLowerCase().includes(keyword.toLowerCase());
      const tagNameMatch = post.tags.some((tag) =>
        tag.name.toLowerCase().includes(keyword.toLowerCase())
      );
      return titleMatch || slugMatch || tagNameMatch;
    });

    return filteredPosts;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleOnClickEdit = (id) => {
    navigate(POST_PATH.EDIT.replace(":id", id));
  };

  const handleOnClickView = (id) => {
    navigate(POST_PATH.VIEW.replace(":id", id));
  };

  const handleBlockPost = async (id, status) => {
    const confirmChangRole = () => {
      return apiBlockMultiplePosts({ postIds: id });
    };

    const confirmChangRoleSuccess = () => {
      getAllPosts();
      setIsShowDropDown(false);
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmChangRoleFail = () => {};

    confirmAlert(
      `${
        status === "one"
          ? "Bạn có muốn chặn bài viết không?"
          : "Bạn có muốn chặn tất cả bài viết không?"
      }`,
      "",
      `${status === "one" ? "Chặn" : "Chặn tất cả"}`,
      "#f97066",
      confirmChangRole,
      confirmChangRoleSuccess,
      confirmChangRoleFail,
      {
        title: `${
          status === "one" ? "Chặn thành công" : "Đã chặn tất cả bài viết"
        }`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const handleUnBlockPost = async (id, status) => {
    const confirmChangRole = () => {
      return apiUnBlockMultiplePosts({ postIds: id });
    };

    const confirmChangRoleSuccess = () => {
      getAllPosts();
      setIsShowDropDown(false);
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmChangRoleFail = () => {};

    confirmAlert(
      `${
        status === "one"
          ? "Bạn có muốn bỏ chặn bài viết không?"
          : "Bạn có muốn bỏ chặn tất cả bài viết không?"
      }`,
      "",
      `${status === "one" ? "Bỏ chặn" : "Bỏ chặn tất cả"}`,
      "#00c491",
      confirmChangRole,
      confirmChangRoleSuccess,
      confirmChangRoleFail,
      {
        title: `${
          status === "one" ? "Bỏ chặn thành công" : "Đã bỏ chặn tất cả bài viết"
        }`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const handleDeleteMultiUser = async (id, status) => {
    const confirmChangRole = () => {
      return apiDeleteMultiplePosts({ postIds: id });
    };

    const confirmChangRoleSuccess = () => {
      getAllPosts();
      setIsShowDropDown(false);
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmChangRoleFail = () => {};

    confirmAlert(
      `${
        status === "one"
          ? "Bạn có muốn xóa bài viết không?"
          : "Bạn có muốn xóa tất cả bài viết không?"
      }`,
      "",
      `${status === "one" ? "Xóa" : "Xóa tất cả"}`,
      "#f97066",
      confirmChangRole,
      confirmChangRoleSuccess,
      confirmChangRoleFail,
      {
        title: `${
          status === "one" ? "Xóa thành công" : "Đã xóa tất cả bài viết"
        }`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div className="thumbnail-name">
          <img
            className="thumbnail"
            src={!!record.thumbnail_url ? record.thumbnail_url : ""}
            alt=""
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      sorter: (a, b) => a.categoryId.name.localeCompare(b.categoryId.name),
      render: (categoryId, record) => <span>{categoryId.name}</span>,
    },
    {
      title: "Lượt xem",
      dataIndex: "view_count",
      sorter: (a, b) => a.view_count - b.view_count,
    },
    {
      title: "Lượt thích",
      dataIndex: "like_count",
      sorter: (a, b) => a.like_count - b.like_count,
    },
    {
      title: "Bình luận",
      dataIndex: "comment_count",
      sorter: (a, b) => a.comment_count - b.comment_count,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Công khai",
          value: "published",
        },
        {
          text: "Nháp",
          value: "draft",
        },
        {
          text: "Bị chặn",
          value: "blocked",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => (
        <span className={`tag ${status}`}>
          {status === "published"
            ? "Công khai"
            : status === "draft"
            ? "Nháp"
            : "Bị chặn"}
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
          <TbEdit
            onClick={() => {
              if (record.status === "blocked") {
                errorAlert(
                  "Không được phép",
                  "Bạn viết đã bị chặn không được phép sửa"
                );
                return;
              }
              handleOnClickEdit(_id);
            }}
            className="icon icon-edit"
          />
          <div
            ref={showDropdownPostId === _id ? dropdownRef : null}
            className="action-dropdown"
          >
            <TbDotsVertical
              onClick={() => {
                setShowDropdownPostId(_id);
                setIsShowDropDown(!isShowDropDown);
              }}
              className="icon icon-dot"
            />
            {isShowDropDown && showDropdownPostId === _id && (
              <div className="dropdown">
                <ul>
                  <li
                    onClick={() => {
                      if (record.status === "blocked") {
                        handleUnBlockPost([_id], "one");
                      } else {
                        handleBlockPost([_id], "one");
                      }
                    }}
                  >
                    {record.status === "blocked" ? "Bỏ chặn" : "Chặn bài viết"}
                  </li>
                  <li
                    onClick={() => {
                      handleDeleteMultiUser([_id], "one");
                    }}
                  >
                    Xóa bài viết
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
    <div className="post-list-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Danh sách bài viết</h1>
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
                  title: "Bài viết",
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
                placeholder="Tìm kiếm bài viết..."
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
            <button
              onClick={() => {
                navigate(POST_PATH.WRITE);
              }}
              className="btn-write-post"
            >
              <FaRegEdit className="icon" /> Viết bài
            </button>
          </div>
        </div>
      </div>
      {posts.length >= 0 && (
        <div className="table">
          {selectedRowKeys.length > 0 && (
            <div className="btn-list-action">
              <button
                onClick={() => {
                  handleDeleteMultiUser(selectedRowKeys, "many");
                }}
                className="btn btn-delete-all"
              >
                {"Xóa tất cả"}
              </button>
              <button
                onClick={() => {
                  handleBlockPost(selectedRowKeys, "many");
                }}
                className="btn btn-block-all"
              >
                {"Chặn tất cả"}
              </button>
              <button
                onClick={() => {
                  handleUnBlockPost(selectedRowKeys, "many");
                }}
                className="btn btn-unblock-all"
              >
                {"Bỏ chặn tất cả"}
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

export default PostList;
