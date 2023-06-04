import React, { useEffect, useRef, useState } from "react";
import "./ChangeAvatar.scss";
import avtDefault from "../../../../assets/images/avatar_default.png";
import Loader from "../../../../components/Loader/Loader";
import { errorAlert, successAlert } from "../../../../utils/customAlert";
import { apiChangeAvatarUser } from "../../../../apis/user";

const ChangeAvatar = (props) => {
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avtUrl, setAvtUrl] = useState(null);
  const [avt, setAvt] = useState(null);

  useEffect(() => {
    setAvtUrl(props.user?.avatar);
  }, [props]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png"].indexOf(extension) !== -1) {
        setAvt(file);
        const reader = new FileReader();

        reader.onload = (e) => {
          setAvtUrl(e.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        errorAlert(
          "Lỗi chọn ảnh",
          "Vui lòng chọn file ảnh có định dạng jpg, png hoặc gif"
        );
      }
    }
  };

  const handleDeleteImage = () => {
    setAvtUrl(null);
    setAvt(null);
    inputFileRef.current.value = "";
  };

  const handleOnSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      let status;
      if (!avtUrl && !avt) status = "delete";
      else if (avt) {
        status = "update";
        formData.append("image", avt);
      }

      await apiChangeAvatarUser(props.user._id, status, formData);
      setIsLoading(false);
      props.closeModal();
      props.getUserByUserId(props.user._id);
      successAlert("Cập nhật thành công", "", 1500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAlert(
        "Cập nhật không thành công",
        "Đã có lỗi xảy ra! Vui lòng thử lại sau"
      );
      props.closeModal();
    }
  };

  return (
    <div className="change-avatar-container">
      <h3>Ảnh đại diện</h3>
      <div className="change-avatar-content">
        <img src={avtUrl ? avtUrl : avtDefault} alt="" />
        <div className="btn-list">
          <label className={`btn btn-replace`} htmlFor="imageInput">
            Thay thế
          </label>
          <input
            type="file"
            id="imageInput"
            className="image-input"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleFileChange}
            ref={inputFileRef}
          />
          <button onClick={handleDeleteImage} className="btn btn-delete">
            Xóa ảnh
          </button>
        </div>
      </div>
      <div className="btn-container">
        <button
          onClick={props.closeModal}
          className="btn btn-cancel"
          type="button"
        >
          Hủy
        </button>
        <button
          disabled={isLoading === true}
          className="btn btn-save"
          onClick={handleOnSave}
        >
          {isLoading ? <Loader /> : "Lưu"}
        </button>
      </div>
    </div>
  );
};

export default ChangeAvatar;
