import { instanceJWT } from "../utils/api";

export const apiGetAllContacts = () => instanceJWT.get("/contact/");
export const apiResolveMultipleContacts = (contactIds) =>
  instanceJWT.put("/contact/resolve", contactIds);
export const apiDeleteMultipleContacts = (contactIds) =>
  instanceJWT.post("/contact/delete/multi", contactIds);
