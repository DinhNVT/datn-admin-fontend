import React, { useEffect, useRef } from "react";
import "./AddUserForm.scss";
import { Modal } from "antd";
import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import { isFullNameValid, validateEmail } from "../../../utils/validates";
import avtDefault from "../../../assets/images/avatar_default.png";
import { errorAlert, successAlert } from "../../../utils/customAlert";
import { TbPhotoEdit } from "react-icons/tb";
import { RiCloseCircleLine } from "react-icons/ri";
import { apiGetAllRoles } from "../../../apis/role";
import { apiAddUser } from "../../../apis/user";

const AddUserForm = (props) => {
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("Ẩn danh");
  const [roleId, setRoleId] = useState("");
  const [avt, setAvt] = useState(null);
  const [avtUrl, setAvtUrl] = useState(null);
  const [options, setOptions] = useState([]);
  const [errorInput, setErrorInput] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorFetch, setErrorFetch] = useState("");

  const handleFullNamChange = (e) => {
    const fullName = e.target.value;
    setFullName(fullName);
    if (!isFullNameValid(fullName)) {
      setErrorInput((prevError) => ({
        ...prevError,
        fullName: "Họ tên không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        fullName: "",
      }));
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    if (!validateEmail(email)) {
      setErrorInput((prevError) => ({
        ...prevError,
        email: "Email không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        email: "",
      }));
    }
  };

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

  const hasError = () => {
    for (const key in errorInput) {
      if (errorInput[key]) {
        return true;
      }
    }
    return false;
  };

  const renderAllRoles = async () => {
    try {
      const roles = await apiGetAllRoles();
      const option = roles.data.roles.map((role) => ({
        id: role._id,
        value: role.name,
        label: role.name.replace(/\b\w/g, (char) => char.toUpperCase()),
      }));
      setOptions(option);
      const userRole = roles.data.roles.find((role) => role.name === "user");
      setRoleId(userRole._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    renderAllRoles();
  }, []);

  const handleChange = (event) => {
    setRoleId(event.target.value);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setErrorFetch("");
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      if (avt) {
        formData.append("avatar", avt);
      }
      formData.append("bio", bio);
      formData.append("roleId", roleId);
      await apiAddUser(formData);
      successAlert("Thêm tài khoản thành công", "");
      props.getAllUsers();
      setIsLoading(false);
      setFullName("");
      setEmail("");
      handleDeleteImage();
      setBio("Ẩn danh");
      setBio("Ẩn danh");
      const userRole = options.data.roles.find((role) => role.value === "user");
      setRoleId(userRole.id);
    } catch (error) {
      setErrorFetch(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const optionsBio = [
    { id: "1", value: "Nông dân", label: "Nông dân" },
    { id: "2", value: "Chủ trang trại", label: "Chủ trang trại" },
    { id: "3", value: "Nhà nghiên cứu", label: "Nhà nghiên cứu" },
    { id: "4", value: "Ẩn danh", label: "Ẩn danh" },
  ];

  const handleChangeBio = (event) => {
    setBio(event.target.value);
  };

  return (
    <div>
      <Modal
        centered
        open={props.isShowModal}
        onCancel={() => props.closeModal()}
        footer={[]}
      >
        <div className="form-content">
          <h2 className="title">Thêm tài khoản</h2>
          {!!errorFetch && (
            <span className="error-text-fetch" aria-hidden="true">
              {errorFetch === "User already exists"
                ? "Email đã tồn tại"
                : errorFetch === "internal_server_error"
                ? "Lỗi hệ thống! Vui lòng thử lại sau"
                : errorFetch}
            </span>
          )}
          <form onSubmit={handleOnSubmit}>
            <div className="change-avatar-content">
              <img src={!!avtUrl ? avtUrl : avtDefault} alt="" />
              <label htmlFor="imageInput">
                <TbPhotoEdit className={"edit-icon"} />
              </label>
              <input
                type="file"
                id="imageInput"
                className="image-input"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
                ref={inputFileRef}
              />
              {avtUrl && (
                <RiCloseCircleLine
                  onClick={handleDeleteImage}
                  className={"delete-icon"}
                />
              )}
            </div>
            <p className="input-container">
              <label>
                Họ tên
                <br />
                <span className="form-control-input" data-name="full-name">
                  <input
                    size="40"
                    className="input"
                    aria-required="true"
                    aria-invalid="true"
                    value={fullName}
                    onChange={handleFullNamChange}
                    type="text"
                    name="full-name"
                    placeholder="Nhập họ tên"
                    required
                  />
                  {!!errorInput.fullName && (
                    <span className="error-text" aria-hidden="true">
                      {errorInput.fullName}
                    </span>
                  )}
                </span>
              </label>
            </p>
            <p className="input-container">
              <label>
                Email
                <br />
                <span className="form-control-input" data-name="email">
                  <input
                    size="40"
                    className="input"
                    aria-required="true"
                    aria-invalid="true"
                    value={email}
                    onChange={handleEmailChange}
                    type="text"
                    name="email"
                    placeholder="Nhập email"
                    required
                  />
                  {!!errorInput.email && (
                    <span className="error-text" aria-hidden="true">
                      {errorInput.email}
                    </span>
                  )}
                </span>
              </label>
            </p>
            <p className="input-container">
              <label>
                Nghề nghiệp
                <br />
                <span className="form-control-input" data-name="title">
                  <select
                    id="cars"
                    value={bio}
                    onChange={handleChangeBio}
                    className="input-select"
                  >
                    {optionsBio?.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </p>
            <p className="input-container">
              <label>
                Quyền
                <br />
                <span className="form-control-input" data-name="title">
                  <select
                    id="cars"
                    value={roleId}
                    onChange={handleChange}
                    className="input-select"
                  >
                    {options?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </p>
            <div className="btn-list">
              <button
                onClick={props.closeModal}
                className="btn btn-cancel"
                type="button"
              >
                Thoát
              </button>
              <button
                type="submit"
                disabled={isLoading === true || hasError()}
                className={`btn btn-save${hasError() ? " error-disable" : ""}`}
              >
                {isLoading ? <Loader /> : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddUserForm;
