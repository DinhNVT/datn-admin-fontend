import { instanceJWT } from "../utils/api";

export const apiGetAllCategories = () =>
  instanceJWT.get("/category-post/get/by-admin");
export const apiCreateCategory = (category) =>
  instanceJWT.post("/category-post/", category);
export const apiUpdateCategory = (id, category) =>
  instanceJWT.put(`category-post/${id}`, category);
export const apiDeleteCategory = (id) =>
  instanceJWT.delete(`category-post/${id}`);
export const apiGetPostsByCategory = (id) =>
  instanceJWT.get(`category-post/posts/${id}`);
