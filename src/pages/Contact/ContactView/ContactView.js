import React from "react";
import "./ContactView.scss";
import { Button, Modal } from "antd";
import { getCreatedAtString } from "../../../utils/convertTime";

const ContactView = (props) => {
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
        <div className="contact-view-container">
          <h2 className="title">Liên hệ</h2>
          <div className="contact-view-content">
            <div className="header">
              <div className="full-name">
                <h3>Họ tên: </h3>
                <p>{props.contact?.fullName}</p>
              </div>
              <span>{getCreatedAtString(props.contact?.createdAt)}</span>
            </div>
            <div className="email">
              <h3>Email: </h3>
              <p>{props.contact?.email}</p>
            </div>
            <div className="status">
              <h3>Trạng thái: </h3>
              <p>
                {props.contact?.status === "pending"
                  ? "Chưa giải quyết"
                  : "Đã giải quyết"}
              </p>
            </div>
            <div className="content">
              <h3>Nội dung: </h3>
              <p>{props.contact?.content}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactView;
