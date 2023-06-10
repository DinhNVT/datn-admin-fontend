import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ViewPost.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HOME_PATH, POST_PATH } from "../../../routes/routers.constant";
import { Breadcrumb } from "antd";
import { RxDashboard } from "react-icons/rx";
import { useSelector } from "react-redux";
import {
  apiCreatePostComments,
  apiDeletePostComments,
  apiGetDetailPostByIdAdmin,
  apiGetPostComments,
  apiUpdatePostComments,
} from "../../../apis/post";
import { deleteAlert, errorAlert } from "../../../utils/customAlert";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { getCreatedAtString } from "../../../utils/convertTime";
import avtDefault from "../.././../assets/images/avatar_default.png";
import facebookIcon from "../.././../assets/images/facebook.png";
import instagramIcon from "../.././../assets/images/instagram.png";
import youtubeIcon from "../.././../assets/images/youtube.png";
import tiktokIcon from "../.././../assets/images/tiktok.png";
import Loader from "../../../components/Loader/Loader";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const ViewPost = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [isFetchPost, setIsFetchPost] = useState(true);

  const [postComments, setPostComments] = useState(null);
  const [postCommentsLoading, setPostCommentsLoading] = useState(false);
  const [isFetchPostComments, setIsFetchPostComments] = useState(true);

  const [replyInputVisible, setReplyInputVisible] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [subCommentId, setSubCommentId] = useState("");
  const [subCommentInput, setSubCommentInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [isLoadingEditBaseComment, setIsLoadingEditBaseComment] =
    useState(false);
  const [isLoadingSubComment, setIsLoadingSubComment] = useState(false);
  const inputRef = useRef(null);
  const { user } = useSelector((state) => state?.auth?.login);

  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownBaseId, setShowDropdownBaseId] = useState("");
  const [showDropdownSubId, setShowDropdownSubId] = useState("");
  const [isBaseEdit, setIsBaseEdit] = useState(false);
  const [isSubEdit, setIsSubEdit] = useState(false);

  const [visibleComments, setVisibleComments] = useState(5);
  const numberCommentVisible = 5;
  const handleViewMoreComments = () => {
    setVisibleComments(postComments.length);
  };

  const handleHideLessComments = () => {
    setVisibleComments(numberCommentVisible);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowDropdownBaseId("");
        setShowDropdownSubId("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getPostComment = async (postId) => {
    try {
      setPostCommentsLoading(true);
      const response = await apiGetPostComments(postId);
      if (response?.data?.result) {
        setPostComments(response?.data?.result);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setPostCommentsLoading(false);
      setIsFetchPostComments(false);
    }
  };

  const getPostDetail = useCallback(async () => {
    setPostLoading(true);
    try {
      const response = await apiGetDetailPostByIdAdmin(id);
      if (!response.data.result) {
        console.log(response);
      } else {
        setPost(response.data.result);
        window.scrollTo(0, 0);
        getPostComment(response?.data?.result?._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchPost(false);
      setPostLoading(false);
      setIsFetchPostComments(false);
    }
  }, [id]);

  useEffect(() => {
    getPostDetail();
  }, [id, getPostDetail]);

  useEffect(() => {
    if (replyInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyInputVisible]);

  const handleCreateSubComment = (baseId) => {
    if (!user) {
      errorAlert("Chưa đăng nhập", "Bạn cần đăng nhập để trả lời bình luận");
    } else {
      setReplyInputVisible(true);
      setCommentId(baseId);
    }
    if (!subCommentInput || baseId !== commentId) {
      setIsBaseEdit(false);
      setIsSubEdit(false);
      setSubCommentId("");
      setSubCommentInput("");
    } else if (replyInputVisible && !!commentId) {
      setIsLoadingSubComment(true);
      apiCreatePostComments("sub", {
        baseId: baseId,
        comment: subCommentInput,
      })
        .then((res) => {
          if (res.data.result) {
            setReplyInputVisible(false);
            setCommentId("");
            setSubCommentInput("");
            getPostComment(post?._id);
            setIsLoadingSubComment(false);
          } else {
            errorAlert("Lỗi", "Xin vui lòng thử lại sau");
            setIsLoadingSubComment(false);
          }
        })
        .catch(() => {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingSubComment(false);
        });
    }
  };

  const handleCreateComment = () => {
    setReplyInputVisible(false);
    setCommentId("");
    if (!user) {
      errorAlert("Chưa đăng nhập", "Bạn cần đăng nhập để bình luận");
    } else {
      setIsLoadingComment(true);
      apiCreatePostComments("base", {
        postId: post?._id,
        comment: commentInput,
      })
        .then((res) => {
          if (res.data.result) {
            setCommentInput("");
            getPostComment(post?._id);
            setIsLoadingComment(false);
          } else {
            errorAlert("Lỗi", "Xin vui lòng thử lại sau");
            setIsLoadingComment(false);
          }
        })
        .catch(() => {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingComment(false);
        });
    }
  };

  const handleEditCommentClick = (commentId, comment) => {
    setIsBaseEdit(true);
    setCommentId(commentId);
    setShowDropdown(!showDropdown);
    setSubCommentInput(comment);
    setReplyInputVisible(true);
    setIsSubEdit(false);
    setSubCommentId("");
  };

  const handleCancelEditCommentClick = () => {
    setIsBaseEdit(false);
    setCommentId("");
    setIsSubEdit(false);
    setSubCommentId("");
  };

  const handleEditSubCommentClick = (subCommentId, comment) => {
    setCommentId("");
    setIsBaseEdit(false);
    setIsSubEdit(true);
    setSubCommentId(subCommentId);
    setShowDropdown(!showDropdown);
    setSubCommentInput(comment);
    setReplyInputVisible(true);
  };

  const handleUpdateBaseComment = (id) => {
    setIsLoadingEditBaseComment(true);
    apiUpdatePostComments(id, "base", {
      comment: subCommentInput,
    })
      .then((res) => {
        if (res.data.result) {
          setSubCommentInput("");
          getPostComment(post?._id);
          setIsLoadingEditBaseComment(false);
          setIsBaseEdit(false);
          setReplyInputVisible(false);
        } else {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingEditBaseComment(false);
        }
      })
      .catch(() => {
        errorAlert("Lỗi", "Xin vui lòng thử lại sau");
        setIsLoadingEditBaseComment(false);
      });
  };

  const handleUpdateSubComment = (id) => {
    setIsLoadingEditBaseComment(true);
    apiUpdatePostComments(id, "sub", {
      comment: subCommentInput,
    })
      .then((res) => {
        if (res.data.result) {
          setSubCommentInput("");
          getPostComment(post?._id);
          setIsLoadingEditBaseComment(false);
          setIsBaseEdit(false);
          setReplyInputVisible(false);
          setIsSubEdit(false);
        } else {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingEditBaseComment(false);
        }
      })
      .catch(() => {
        errorAlert("Lỗi", "Xin vui lòng thử lại sau");
        setIsLoadingEditBaseComment(false);
      });
  };

  const handleDeleteCommentClick = (status, id) => {
    setShowDropdown(false);
    const confirmDelete = () => {
      return apiDeletePostComments(id, status);
    };

    const deletePostInState = () => {
      getPostComment(post?._id);
    };

    deleteAlert(
      "Xóa bình luận",
      "Bạn có chắc chắn muốn xóa bình luận không?",
      confirmDelete,
      deletePostInState
    );
  };
  return (
    <div className="post-edit-container">
      <div className="header">
        <div className="header-content">
          <div className="title">
            <h1>Chi tiết bài viết</h1>
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
                  to: POST_PATH.LIST,
                  title: (
                    <Link to={POST_PATH.LIST}>
                      <span>Danh sách bài viết</span>
                    </Link>
                  ),
                },
                {
                  title: "Chi tiết bài viết",
                },
              ]}
            />
          </div>
          <div className="right">
            <button
              onClick={() => {
                navigate(POST_PATH.LIST);
              }}
              className="btn-add-user"
            >
              Xem danh sách bài viết
            </button>
          </div>
        </div>
      </div>
      <div className="edit-content">
        <div className="post-detail-content">
          {!!post && !isFetchPost && (
            <div className="post-content">
              <div className="post-content-header">
                <img src={post?.thumbnail_url} alt={post?.title} />
                <h1>{post?.title}</h1>
                <div className="interact">
                  <div className="interact-item">
                    <RxCountdownTimer className={"icon"} size={22} />{" "}
                    <p>{getCreatedAtString(post?.createdAt)}</p>
                  </div>
                  <div className="interact-item">
                    <FaRegComment className={"icon"} size={22} />{" "}
                    <p>{post?.comment_count} bình luận</p>
                  </div>
                  <div className="interact-item">
                    <AiOutlineEye className={"icon"} size={24} />{" "}
                    <p>{post?.view_count} lượt xem</p>
                  </div>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: post?.content }}
                className="content"
              />
              <div className="tags">
                <h1 className="tags-title">Tags</h1>
                <div className="tags-list">
                  {post?.tags?.map((tag, index) => (
                    <Link key={tag._id} className={`item-tag tag-${index + 1}`}>
                      <span># </span>
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!post && !isFetchPost && (
            <p className="not-found-text">Không có bài viết này</p>
          )}
          {(isFetchPost || postLoading) && (
            <div className="post-content-skeleton">
              <div className="post-content-header">
                <div className="thumbnail-skeleton skeleton"></div>
                <div className="title-skeleton skeleton"></div>
                <div className="title-skeleton small skeleton"></div>
                <div className="interact">
                  <div className="interact-item">
                    <div className="interact-item-left skeleton"></div>
                    <div className="interact-item-right skeleton"></div>
                  </div>
                  <div className="interact-item">
                    <div className="interact-item-left skeleton"></div>
                    <div className="interact-item-right skeleton"></div>
                  </div>
                  <div className="interact-item">
                    <div className="interact-item-left skeleton"></div>
                    <div className="interact-item-right skeleton"></div>
                  </div>
                </div>
              </div>
              <div className="content-skeleton">
                <div className="content-text skeleton"></div>
                <div className="content-text skeleton"></div>
                <div className="content-text skeleton"></div>
                <div className="content-text skeleton"></div>
                <div className="content-text skeleton"></div>
                <div className="content-text skeleton"></div>
              </div>
            </div>
          )}
          {!!post && !isFetchPost && (
            <div className="author">
              <div className="title">
                <h1>Tác giả</h1>
              </div>
              <div className="author-content">
                <div className="author-content-info">
                  <div className="left">
                    <Link>
                      <img
                        src={
                          !!post?.userId?.avatar
                            ? post?.userId?.avatar
                            : avtDefault
                        }
                        alt={post?.userId?.name}
                      />
                    </Link>
                  </div>
                  <div className="right">
                    <h2>{post?.userId?.name}</h2>
                    <p>{post?.userId?.bio}</p>
                    {!!post?.userId?.social && (
                      <div className="social">
                        {!!post?.userId?.social?.facebook && (
                          <Link
                            to={post?.userId?.social?.facebook}
                            target="_blank"
                          >
                            <img src={facebookIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.instagram && (
                          <Link
                            to={post?.userId?.social?.instagram}
                            target="_blank"
                          >
                            <img src={instagramIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.youtube && (
                          <Link
                            to={post?.userId?.social?.youtube}
                            target="_blank"
                          >
                            <img src={youtubeIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.tiktok && (
                          <Link
                            to={post?.userId?.social?.tiktok}
                            target="_blank"
                          >
                            <img src={tiktokIcon} alt="" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {isFetchPost && postLoading && (
            <div className="author-skeleton">
              <div className="title skeleton"></div>
              <div className="author-content">
                <div className="author-content-info">
                  <div className="left skeleton"></div>
                  <div className="right">
                    <div className="name skeleton"></div>
                    <div className="bio skeleton"></div>
                    <div className="social">
                      <div className="icon skeleton"></div>
                      <div className="icon skeleton"></div>
                      <div className="icon skeleton"></div>
                      <div className="icon skeleton"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!!postComments && !isFetchPostComments && (
            <div className="comment">
              <div className="title">
                <h1>Bình luận</h1>
              </div>
              <div className="comment-content">
                <div className="main-input">
                  <h2>Viết bình luận</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateComment();
                    }}
                  >
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                      placeholder="Bình luận..."
                      className="input"
                    />
                    <button
                      disabled={
                        isLoadingComment === true &&
                        isLoadingSubComment === true
                      }
                      type="submit"
                      className="btn-reply large"
                    >
                      {isLoadingComment ? <Loader /> : "Bình luận"}
                    </button>
                  </form>
                </div>
                {!!postComments &&
                  !isFetchPostComments &&
                  !!post &&
                  postComments
                    .slice(0, visibleComments)
                    .map((comment, index) => (
                      <div key={comment._id}>
                        <div
                          className={`base-comment${
                            index === -1 ? " border-none" : ""
                          }`}
                        >
                          <img
                            src={
                              !!comment.userId.avatar
                                ? comment.userId.avatar
                                : avtDefault
                            }
                            alt=""
                          />
                          <div className="main-content">
                            <div className="info">
                              <h3>{comment.userId.name}</h3>
                              <p>{getCreatedAtString(comment.createdAt)}</p>
                            </div>
                            {isBaseEdit && commentId === comment._id ? null : (
                              <p>{comment.comment}</p>
                            )}
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (isBaseEdit && commentId === comment._id) {
                                  handleUpdateBaseComment(comment._id);
                                } else {
                                  handleCreateSubComment(comment._id);
                                  setIsBaseEdit(false);
                                }
                              }}
                            >
                              {replyInputVisible &&
                              commentId === comment._id ? (
                                <textarea
                                  ref={inputRef}
                                  value={subCommentInput}
                                  onChange={(e) =>
                                    setSubCommentInput(e.target.value)
                                  }
                                  required
                                  placeholder="Trả lời..."
                                  className="input"
                                />
                              ) : undefined}
                              {isBaseEdit && commentId === comment._id ? (
                                <div className="btn-edit-container">
                                  <button
                                    onClick={handleCancelEditCommentClick}
                                    type="button"
                                    className="btn-cancel"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    disabled={
                                      isLoadingComment === true ||
                                      isLoadingEditBaseComment === true
                                    }
                                    type="submit"
                                    className="btn-reply"
                                  >
                                    {isLoadingEditBaseComment &&
                                    commentId === comment._id ? (
                                      <Loader />
                                    ) : (
                                      "Lưu"
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  disabled={
                                    isLoadingSubComment === true ||
                                    isLoadingComment === true
                                  }
                                  type="submit"
                                  className="btn-reply"
                                >
                                  {isLoadingSubComment &&
                                  commentId === comment._id ? (
                                    <Loader />
                                  ) : (
                                    "Trả lời"
                                  )}
                                </button>
                              )}
                            </form>
                          </div>
                          <div
                            ref={
                              showDropdownBaseId === comment._id
                                ? dropdownRef
                                : null
                            }
                            className="action-comment"
                          >
                            <BiDotsVerticalRounded
                              onClick={() => {
                                setShowDropdownBaseId(comment._id);
                                setShowDropdownSubId("");
                                setShowDropdown(!showDropdown);
                              }}
                              className={"icon-three-dot"}
                            />
                            {showDropdown &&
                            showDropdownBaseId === comment._id ? (
                              <div className="dropdown-action">
                                <ul>
                                  {user?._id === comment.userId._id && (
                                    <li
                                      onClick={() => {
                                        handleEditCommentClick(
                                          comment._id,
                                          comment.comment
                                        );
                                      }}
                                    >
                                      Chỉnh sửa
                                    </li>
                                  )}
                                  {user?.roleId.name === "admin" && (
                                    <li
                                      onClick={() => {
                                        handleDeleteCommentClick(
                                          "base",
                                          comment._id
                                        );
                                      }}
                                    >
                                      Xóa
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {!!comment.subComments &&
                          comment.subComments
                            .slice(0, visibleComments)
                            .map((subComments, index) => (
                              <div
                                key={subComments._id}
                                className="base-comment sub-comment"
                              >
                                <img
                                  src={
                                    !!subComments.userId.avatar
                                      ? subComments.userId.avatar
                                      : avtDefault
                                  }
                                  alt=""
                                />
                                <div className="main-content">
                                  <div className="info">
                                    <h3>{subComments.userId.name}</h3>
                                    <p>
                                      {getCreatedAtString(
                                        subComments.createdAt
                                      )}
                                    </p>
                                  </div>
                                  {isSubEdit &&
                                  subCommentId === subComments._id ? null : (
                                    <p>{subComments.comment}</p>
                                  )}

                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      handleUpdateSubComment(subComments._id);
                                    }}
                                  >
                                    {replyInputVisible &&
                                    subCommentId === subComments._id ? (
                                      <textarea
                                        ref={inputRef}
                                        value={subCommentInput}
                                        onChange={(e) =>
                                          setSubCommentInput(e.target.value)
                                        }
                                        required
                                        placeholder="Trả lời..."
                                        className="input"
                                      />
                                    ) : undefined}
                                    {isSubEdit &&
                                    subCommentId === subComments._id ? (
                                      <div className="btn-edit-container">
                                        <button
                                          onClick={handleCancelEditCommentClick}
                                          type="button"
                                          className="btn-cancel"
                                        >
                                          Hủy
                                        </button>
                                        <button
                                          disabled={
                                            isLoadingComment === true ||
                                            isLoadingEditBaseComment === true
                                          }
                                          type="submit"
                                          className="btn-reply"
                                        >
                                          {isLoadingEditBaseComment &&
                                          subCommentId === subComments._id ? (
                                            <Loader />
                                          ) : (
                                            "Lưu"
                                          )}
                                        </button>
                                      </div>
                                    ) : null}
                                  </form>
                                  {/* <textarea
                              // value={this.state.text}
                              // onChange={this.handleChange}
                              required
                              placeholder="Bình luận..."
                              className="input"
                            />
                            <button className="btn-reply">Trả lời</button> */}
                                </div>
                                <div
                                  ref={
                                    showDropdownSubId === subComments._id
                                      ? dropdownRef
                                      : null
                                  }
                                  className="action-comment"
                                >
                                  <BiDotsVerticalRounded
                                    onClick={() => {
                                      setShowDropdownBaseId("");
                                      setShowDropdownSubId(subComments._id);
                                      setShowDropdown(!showDropdown);
                                    }}
                                    className={"icon-three-dot"}
                                  />
                                  {showDropdown &&
                                  showDropdownSubId === subComments._id ? (
                                    <div className="dropdown-action">
                                      <ul>
                                        {user?._id ===
                                          subComments.userId._id && (
                                          <li
                                            onClick={() => {
                                              handleEditSubCommentClick(
                                                subComments._id,
                                                subComments.comment
                                              );
                                            }}
                                          >
                                            Chỉnh sửa
                                          </li>
                                        )}
                                        {user?._id ===
                                          subComments.userId._id && (
                                          <li
                                            onClick={() => {
                                              handleDeleteCommentClick(
                                                "sub",
                                                subComments._id
                                              );
                                            }}
                                          >
                                            Xóa
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                      </div>
                    ))}
                {postComments.length > numberCommentVisible && (
                  <div className="see-more">
                    <button
                      onClick={() => {
                        if (visibleComments > numberCommentVisible) {
                          handleHideLessComments();
                        } else {
                          handleViewMoreComments();
                        }
                      }}
                      className="btn-see-more"
                    >
                      <div>
                        {visibleComments > numberCommentVisible
                          ? "Ẩn bớt"
                          : "Xem tất cả bình luận"}
                        {visibleComments > numberCommentVisible ? (
                          <MdKeyboardArrowUp size={24} className={"arrow"} />
                        ) : (
                          <MdKeyboardArrowDown size={24} className={"arrow"} />
                        )}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {(isFetchPostComments || postCommentsLoading) && (
            <div className="comment-skeleton">
              <div className="title skeleton"></div>
              <div className="label-comment skeleton"></div>
              <div className="input-comment skeleton"></div>
              <div className="button-comment skeleton"></div>
              <div className="base-comment">
                <div className="left skeleton"></div>
                <div className="right">
                  <div className="name-time">
                    <div className="name skeleton"></div>
                    <div className="time skeleton"></div>
                  </div>
                  <div className="comment-content skeleton"></div>
                  <div className="comment-content skeleton"></div>
                  <div className="comment-content skeleton"></div>
                  <div className="button-base-comment skeleton"></div>
                </div>
                <div></div>
              </div>
              <div className="base-comment">
                <div className="left skeleton"></div>
                <div className="right">
                  <div className="name-time">
                    <div className="name skeleton"></div>
                    <div className="time skeleton"></div>
                  </div>
                  <div className="comment-content skeleton"></div>
                  <div className="comment-content skeleton"></div>
                  <div className="comment-content skeleton"></div>
                  <div className="button-base-comment skeleton"></div>
                </div>
                <div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
