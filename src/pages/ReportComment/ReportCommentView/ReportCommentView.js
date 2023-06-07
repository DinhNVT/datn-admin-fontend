import React from "react";
import "./ReportCommentView.scss";
import { Button, Modal } from "antd";
import { getCreatedAtString } from "../../../utils/convertTime";

const ReportCommentView = (props) => {
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
        <div className="report-comment-view-container">
          <h2 className="title">Liên hệ</h2>
          <div className="contact-view-content">
            <div className="header">
              <div className="full-name">
                <h3>Người bình luận: </h3>
                <p>{props.reportComment?.userId?.name}</p>
              </div>
              <span>{getCreatedAtString(props.reportComment?.createdAt)}</span>
            </div>
            <div className="email">
              <h3>Bài viết: </h3>
              <p>{props.reportComment?.postId?.title}</p>
            </div>
            <div className="status">
              <h3>Trạng thái: </h3>
              <p>
                {props.reportComment?.status === "pending"
                  ? "Chưa giải quyết"
                  : "Đã giải quyết"}
              </p>
            </div>
            <div className="content">
              <h3>Nội dung bình luận: </h3>
              <p>{props.reportComment?.comment}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportCommentView;
