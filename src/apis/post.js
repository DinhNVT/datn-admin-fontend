import { instance, instanceJWT } from "../utils/api";

export const apiGetAllPostsByAdmin = () =>
  instanceJWT.get("/posts/admin/get-all");
export const apiGetAllTags = () => instanceJWT.get(`/posts/tags`);
export const createPost = (post) =>
  instanceJWT.post("/posts/", post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const apiGetDetailPostByRole = (id) =>
  instanceJWT.get(`/posts/detail/${id}`);
export const updatePost = (post, id) =>
  instanceJWT.put(`/posts/${id}`, post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const apiGetDetailPostByIdAdmin = (id) =>
  instanceJWT.get(`/posts/admin/detail/${id}`);

//comment
export const apiGetPostComments = (postId) =>
  instance.get(`/posts/comment?postId=${postId}`);
export const apiCreatePostComments = (status, comment) =>
  instanceJWT.post(`/posts/comment?status=${status}`, comment);
export const apiUpdatePostComments = (id, status, comment) =>
  instanceJWT.put(`/posts/comment/${id}?status=${status}`, comment);
export const apiDeletePostComments = (id, status) =>
  instanceJWT.delete(`/posts/comment/${id}?status=${status}`);

//admin
export const apiBlockMultiplePosts = (postIds) =>
  instanceJWT.put(`/posts/admin/block`, postIds);
export const apiUnBlockMultiplePosts = (postIds) =>
  instanceJWT.put(`/posts/admin/unblock`, postIds);
export const apiDeleteMultiplePosts = (postIds) =>
  instanceJWT.post(`/posts/admin/delete-many-posts`, postIds);
