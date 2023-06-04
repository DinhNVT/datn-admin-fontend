import { instanceJWT } from "../utils/api";

export const apiGetAllRoles = () => instanceJWT.get("/roles/");
