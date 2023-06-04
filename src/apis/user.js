import { instanceJWT } from "../utils/api";

export const apiGetAllUsers = () => instanceJWT.get("/users/");
