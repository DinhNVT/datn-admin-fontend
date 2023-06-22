import React from "react";
import "./VideoYoutubeView.scss";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";

const VideoYoutubeView = (props) => {
  return (
    <div>
      <Modal
        centered
        open={props.isShowModal}
        onCancel={() => props.closeModal()}
        footer={[
          <Button
            key="cancel"
            className="custom-cancel-button"
            onClick={() => props.closeModal()}
          >
            Ok
          </Button>,
        ]}
      >
        <div className="video-view-container">
          <h2 className="title">Video</h2>
          <div className="video-item">
            <iframe
              src={`https://www.youtube.com/embed/${props.video.videoId}?start=1`}
              title={props.video.title}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              className="youtube-video"
            ></iframe>
            <Link
              target="_blank"
              to={`https://www.youtube.com/watch?v=${props.video.videoId}`}
            >
              <h3 className="title">{props.video.title}</h3>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoYoutubeView;
