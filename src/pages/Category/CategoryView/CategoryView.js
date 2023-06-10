import React, { useEffect, useState } from "react";
import "./CategoryView.scss";
import { Button, Modal } from "antd";
import { apiGetPostsByCategory } from "../../../apis/category";
import { Link } from "react-router-dom";
import { createSummary, truncateTitle } from "../../../utils/truncateString";
import { getCreatedAtString } from "../../../utils/convertTime";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { POST_PATH } from "../../../routes/routers.constant";

const CategoryView = (props) => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isFetchPosts, setIsFetchPosts] = useState(true);

  const [category, setCategory] = useState("");
  const getPostsByCategoryId = async (id) => {
    try {
      setPostsLoading(true);
      const res = await apiGetPostsByCategory(id);
      if (res.data.posts.length > 0) {
        setPosts(res.data.posts);
      }
      if (!!res.data.category) {
        setCategory(res.data.category);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchPosts(false);
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (!!props.id) getPostsByCategoryId(props.id);
  }, [props.id]);

  return (
    <div>
      <Modal
        centered
        open={props.isShowModal}
        onCancel={() => props.closeModal()}
        footer={[
          <Button
            key="cancel"
            className="custom-cancel-button"
            onClick={() => props.closeModal()}
          >
            Ok
          </Button>,
          // <Button
          //   key="ok"
          //   className="custom-ok-button"
          //   type="primary"
          //   onClick={() => props.loseModal()}
          // >
          //   Xác nhận
          // </Button>,
        ]}
      >
        <div className="category-view-container">
          {category && (
            <h2 className="title">{`Danh mục "${category?.name}"`}</h2>
          )}
          <div className="category-list">
            {posts.length > 0 &&
              !isFetchPosts &&
              posts.map((post, index) => (
                <div key={post._id} className="blog-item">
                  <div className={`status ${post.status}`}>
                    {post.status === "draft"
                      ? "Nháp"
                      : post.status === "published"
                      ? "Công khai"
                      : "Bị chặn"}
                  </div>
                  <div className="blog-item-content">
                    <Link to={POST_PATH.VIEW.replace(":id", post?._id)}>
                      <img src={post?.thumbnail_url} alt={post?.title} />
                    </Link>
                    <div className="blog-post-info">
                      <Link
                        to={POST_PATH.VIEW.replace(":id", post?._id)}
                        className="title"
                      >
                        <h3>{truncateTitle(post.title, 85)}</h3>
                      </Link>
                      <div className="interact">
                        <div className="interact-item">
                          <RxCountdownTimer className={"icon"} size={22} />{" "}
                          <p>{getCreatedAtString(post.createdAt)}</p>
                        </div>
                        <div className="interact-item">
                          <FaRegComment className={"icon"} size={22} />{" "}
                          <p>{post.comment_count} bình luận</p>
                        </div>
                        <div className="interact-item">
                          <AiOutlineEye className={"icon"} size={24} />{" "}
                          <p>{post.view_count} lượt xem</p>
                        </div>
                      </div>
                      {createSummary(post.content, 300)}
                      <div className="tags">
                        {post.tags.length > 0 &&
                          post.tags.map((tag, index) => (
                            <Link
                              key={tag._id}
                              className={`item-tag tag-${index + 1}`}
                            >
                              <span># </span>
                              {tag.name}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {posts.length <= 0 && !isFetchPosts && (
              <p className="not-found-text">Không có bài viết nào</p>
            )}
            {postsLoading && isFetchPosts && (
              <>
                <div className="blog-item-skeleton">
                  <div className={`status skeleton`}></div>
                  <div className="blog-item-content">
                    <div className="img skeleton" src="" alt="" />
                    <div className="blog-post-info">
                      <div className="title">
                        <div className="title-top skeleton"></div>
                        <div className="title-bottom skeleton"></div>
                      </div>
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
                      <div className="content">
                        <div className="content-top skeleton"></div>
                        <div className="content-middle skeleton"></div>
                        <div className="content-bottom skeleton"></div>
                      </div>
                      <div className="tags">
                        <div className="item-tag skeleton"></div>
                        <div className="item-tag skeleton"></div>
                        <div className="item-tag skeleton"></div>
                        <div className="item-tag skeleton"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="blog-item-skeleton">
                  <div className={`status skeleton`}></div>
                  <div className="blog-item-content">
                    <div className="img skeleton" src="" alt="" />
                    <div className="blog-post-info">
                      <div className="title">
                        <div className="title-top skeleton"></div>
                        <div className="title-bottom skeleton"></div>
                      </div>
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
                      <div className="content">
                        <div className="content-top skeleton"></div>
                        <div className="content-middle skeleton"></div>
                        <div className="content-bottom skeleton"></div>
                      </div>
                      <div className="tags">
                        <div className="item-tag skeleton"></div>
                        <div className="item-tag skeleton"></div>
                        <div className="item-tag skeleton"></div>
                        <div className="item-tag skeleton"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryView;
