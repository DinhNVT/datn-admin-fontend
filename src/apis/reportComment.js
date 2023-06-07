import { instanceJWT } from "../utils/api";

export const apiGetAllReportComments = () =>
  instanceJWT.get("/posts/comment/report");
export const apiResolveMultipleReportComments = (reportIds) =>
  instanceJWT.put("/posts/comment/report/resolve/multiple", reportIds);
export const apiDeleteMultipleReportComments = (reportIds) =>
  instanceJWT.put("/posts/comment/report/delete/multiple", reportIds);
