import { instanceJWT } from "../utils/api";

export const apiGetAllUsers = () => instanceJWT.get("/users/");
export const apiGetUserById = (id) => instanceJWT.get(`/users/${id}`);
export const apiAddUser = (user) =>
  instanceJWT.post("/users/", user, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const apiUpdateUserProfile = (id, status, data) =>
  instanceJWT.put(`/users/${id}?status=${status}`, data);
export const apiChangeAvatarUser = (id, status, data) =>
  instanceJWT.put(`/users/avatar/${id}?status=${status}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const apiBlockUser = (id) => instanceJWT.put(`/users/block/${id}`);
export const apiUnBlockUser = (id) => instanceJWT.put(`/users/unblock/${id}`);
export const apiChangeRoleUser = (id, role) =>
  instanceJWT.put(`/users/role-change/${id}`, role);
export const apiChangeRolesUser = (roles) =>
  instanceJWT.put(`/users/change-roles/users`, roles);
export const apiBlockAndUnBlockUsers = (blocks) =>
  instanceJWT.put(`/users/block-unblock/users`, blocks);
