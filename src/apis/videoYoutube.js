import { instanceJWT } from "../utils/api";

export const apiGetAllVideosYoutube = () =>
  instanceJWT.get("/video-youtube/admin");
export const apiCreateVideoYoutube = (video) =>
  instanceJWT.post("/video-youtube/", video);
export const apiUpdateVideoYoutube = (id, video) =>
  instanceJWT.put(`/video-youtube/${id}`, video);
export const apiDeleteMultipleVideosYoutube = (videoIds) =>
  instanceJWT.post("/video-youtube/delete-many", videoIds);
