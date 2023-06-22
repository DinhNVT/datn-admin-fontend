import React, { useEffect, useState } from "react";
import "./VideoYoutubeList.scss";
import { Breadcrumb, Table } from "antd";
import { getCreatedAtString } from "../../utils/convertTime";
import { TbEye, TbEdit, TbTrash } from "react-icons/tb";
import Loader from "../../components/Loader/Loader";
import {
  confirmAlert,
  errorAlert,
  successAlert,
} from "../../utils/customAlert";
import { HOME_PATH } from "../../routes/routers.constant";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";
import VideoYoutubeView from "./VideoYoutubeView/VideoYoutubeView";
import { MdOutlineClose } from "react-icons/md";
import {
  apiCreateVideoYoutube,
  apiDeleteMultipleVideosYoutube,
  apiGetAllVideosYoutube,
  apiUpdateVideoYoutube,
} from "../../apis/videoYoutube";

const VideoYoutubeList = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("create");
  const [videoUpdate, setVideoUpdate] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [isShowModalView, setIsShowModalView] = useState(false);
  const [videoView, setVideoView] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const closeModalView = () => {
    setIsShowModalView(false);
  };

  const openModalView = () => {
    setIsShowModalView(true);
  };

  const getAllVideos = async () => {
    setIsLoadingData(true);
    try {
      const res = await apiGetAllVideosYoutube();
      if (res.data.videos.length >= 0) {
        const modifiedVideos = res.data.videos.map((video) => {
          return { ...video, key: video._id };
        });
        setVideos(modifiedVideos);
      }
      setIsLoadingData(false);
    } catch (error) {
      console.log(error);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  const handleTitleChange = (e) => {
    const text = e.target.value;
    setTitle(text);
  };

  const handleVideoIdChange = (e) => {
    const text = e.target.value;
    setVideoId(text);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.status === "resolved",
    // }),
  };

  const handleOnClickView = (id) => {
    const videoFind = videos.find((video) => video._id === id);
    setVideoView(videoFind);
    openModalView();
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mã video",
      dataIndex: "videoId",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (createdAt) => <span>{getCreatedAtString(createdAt)}</span>,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      render: (_id) => (
        <div className="action-list">
          <TbEye
            onClick={() => {
              handleOnClickView(_id);
            }}
            className="icon icon-view"
          />
          <TbEdit
            onClick={() => {
              handleEditVideo(_id);
            }}
            className="icon icon-edit"
          />
          <TbTrash
            onClick={() => {
              handleDeleteVideo([_id], "one");
            }}
            className="icon icon-delete"
          />
        </div>
      ),
    },
  ];

  const handleDeleteVideo = async (id, status) => {
    const confirmDeleteVideoYoutube = () => {
      return apiDeleteMultipleVideosYoutube({ videoIds: id });
    };

    const confirmDeleteVideoYoutubeSuccess = () => {
      getAllVideos();
      if (status !== "one") setSelectedRowKeys([]);
    };

    const confirmDeleteVideoYoutubeFail = () => {};

    confirmAlert(
      `${status === "one" ? "Xóa video" : "Xóa tất cả video"}`,
      "",
      `${status === "one" ? "Xóa" : "Xóa tất cả"}`,
      "#f97066",
      confirmDeleteVideoYoutube,
      confirmDeleteVideoYoutubeSuccess,
      confirmDeleteVideoYoutubeFail,
      {
        title: `${status === "one" ? "Xóa thành công" : "Đã xóa tất cả video"}`,
        text: "",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const handleCreateVideo = async () => {
    setIsLoading(true);
    try {
      await apiCreateVideoYoutube({ title: title, videoId: videoId });
      getAllVideos();
      successAlert("Đã thêm video thành công");
      setIsLoading(false);
      setTitle("");
      setVideoId("");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAlert("Đã xảy ra lỗi", "Vui lòng thử lại sau");
    }
  };

  const cancelOnclick = () => {
    setStatus("create");
    setTitle("");
    setVideoId("");
    setVideoUpdate(null);
  };

  const handleEditVideo = (videoId) => {
    const selectedVideo = videos.find((video) => video._id === videoId);
    if (selectedVideo) {
      setStatus("update");
      setTitle(selectedVideo.title);
      setVideoId(selectedVideo.videoId);
      setVideoUpdate(selectedVideo);
    }
  };

  const handleUpdateVideo = async () => {
    setIsLoading(true);
    try {
      await apiUpdateVideoYoutube(videoUpdate._id, {
        title: title,
        videoId: videoId,
      });
      getAllVideos();
      successAlert("Đã cập nhật video thành công");
      setIsLoading(false);
      setTitle("");
      setVideoId("");
      setStatus("create");
      setVideoUpdate(null);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAlert("Đã xảy ra lỗi", "Vui lòng thử lại sau");
    }
  };

  const handleSearch = () => {
    const filteredVideos = videos.filter((video) => {
      const title = video.title.toLowerCase().includes(keyword.toLowerCase());
      return title;
    });

    return filteredVideos;
  };
  return (
    <div className="video-list-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Danh sách video youtube</h1>
            <Breadcrumb
              items={[
                {
                  to: HOME_PATH,
                  title: (
                    <Link to={HOME_PATH}>
                      <RxDashboard className="icon-bread-crumb" />
                    </Link>
                  ),
                },
                {
                  title: "Video Youtube",
                },
              ]}
            />
          </div>

          <div className="right">
            <div className="search">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="input-search"
                placeholder="Tìm kiếm video..."
                type="text"
                name="search"
                autoComplete="off"
              ></input>
              {!!keyword && (
                <MdOutlineClose
                  onClick={() => {
                    setKeyword("");
                  }}
                  className={"icon-search"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="video-content">
        <div className="add-edit-video">
          <h3 className="title">
            {status === "update" ? "Sửa video" : "Tạo video"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (status === "update") {
                handleUpdateVideo();
              } else if (status === "create") {
                handleCreateVideo();
              }
            }}
          >
            <p className="input-container">
              <label>
                Tiêu đề video <span>*</span>
                <br />
                <span className="form-control-input">
                  <input
                    size="40"
                    className="input"
                    aria-required="true"
                    aria-invalid="true"
                    value={title}
                    onChange={handleTitleChange}
                    type="text"
                    name="title-video"
                    placeholder="Nhập tiêu đề"
                    required
                    autoComplete="off"
                  />
                </span>
              </label>
            </p>
            <p className="input-container">
              <label>
                Mã video <span>*</span>
                <br />
                <span className="form-control-input">
                  <input
                    size="40"
                    className="input"
                    aria-required="true"
                    aria-invalid="true"
                    value={videoId}
                    onChange={handleVideoIdChange}
                    type="text"
                    name="id-video"
                    placeholder="Nhập mã video"
                    required
                    autoComplete="off"
                  />
                </span>
              </label>
            </p>
            <div className="btn-video">
              {status === "update" && (
                <button
                  onClick={cancelOnclick}
                  type="button"
                  className="cancel"
                >
                  Hủy
                </button>
              )}

              <button
                type="submit"
                className="btn btn-add"
                disabled={isLoading === true}
              >
                {isLoading ? (
                  <Loader />
                ) : status === "create" ? (
                  "Tạo Video"
                ) : (
                  "Lưu"
                )}
              </button>
            </div>
          </form>
        </div>
        {videos.length >= 0 && (
          <div className="table">
            {selectedRowKeys.length > 0 && (
              <div className="btn-list-action">
                <button
                  onClick={() => {
                    handleDeleteVideo(selectedRowKeys, "many");
                  }}
                  className="btn btn-delete-all"
                >
                  {"Xóa tất cả"}
                </button>
              </div>
            )}
            <Table
              dataSource={handleSearch()}
              columns={columns}
              loading={isLoadingData}
              pagination={{
                pageSize: 10,
              }}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
            />
          </div>
        )}
        {isShowModalView && (
          <VideoYoutubeView
            isShowModal={isShowModalView}
            closeModal={closeModalView}
            video={videoView}
          />
        )}
      </div>
    </div>
  );
};

export default VideoYoutubeList;
