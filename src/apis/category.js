import { instanceJWT } from "../utils/api";

export const apiGetAllCategories = () =>
  instanceJWT.get("/category-post/get/by-admin");
