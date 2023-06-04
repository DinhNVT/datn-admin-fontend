import React, { useEffect, useState } from "react";
import "./CategoryList.scss";
import { Table } from "antd";
import { getCreatedAtString } from "../../../utils/convertTime copy";
import { RiSearchLine } from "react-icons/ri";
import { apiGetAllCategories } from "../../../apis/category";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const getAllCategories = async () => {
    try {
      const res = await apiGetAllCategories();
      if (res.data.categories.length > 0) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
    // if (!validateEmail(email)) {
    //   setErrorInput((prevError) => ({
    //     ...prevError,
    //     email: "Email không hợp lệ",
    //   }));
    // } else {
    //   setErrorInput((prevError) => ({
    //     ...prevError,
    //     email: "",
    //   }));
    // }
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setDescription(description);
    // if (!validateEmail(email)) {
    //   setErrorInput((prevError) => ({
    //     ...prevError,
    //     email: "Email không hợp lệ",
    //   }));
    // } else {
    //   setErrorInput((prevError) => ({
    //     ...prevError,
    //     email: "",
    //   }));
    // }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => <span>{getCreatedAtString(createdAt)}</span>,
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => <div>{_id}</div>,
    },
  ];
  return (
    <div className="category-list-container">
      <div className="header">
        <div className="header-content">
          <h1>Danh mục</h1>
          <div className="right">
            <div className="search">
              <input className="input-search" placeholder="Tìm kiếm..."></input>
              <RiSearchLine className={"icon-search"} />
            </div>
          </div>
        </div>
      </div>
      <div className="category-content">
        <div className="add-edit-category">
          <h3 className="title">Tạo danh mục</h3>
          <form>
            <p className="input-container">
              <label>
                Tên danh mục <span>*</span>
                <br />
                <span className="form-control-input">
                  <input
                    size="40"
                    className="input"
                    aria-required="true"
                    aria-invalid="true"
                    value={name}
                    onChange={handleNameChange}
                    type="text"
                    name="name-category"
                    placeholder="Nhập tên"
                    required
                  />
                  {/* {!!errorInput.email && (
                    <span className="error-text" aria-hidden="true">
                      {errorInput.email}
                    </span>
                  )} */}
                </span>
              </label>
            </p>
            <p className="input-container">
              <label>
                Mô tả <span>*</span>
                <br />
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  required
                  placeholder="Viết mô tả..."
                  className="input-text-area"
                />
                {/* {!!errorInput.content && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.content}
                  </span>
                )} */}
              </label>
            </p>
            <div className="btn-category">
              <button type="button" className="cancel">Thoát</button>
              <button
                type="submit"
                className="add"
                // className={`login${
                //   errorInput.email !== "" ? " error-disable" : ""
                // }`}
                // disabled={isLoading === true}
              >
                Tạo Danh Mục
                {/* {isLoading ? <Loader /> : "Đăng nhập"} */}
              </button>
            </div>
          </form>
        </div>
        {categories.length > 0 && (
          <div className="table">
            <Table
              dataSource={categories}
              columns={columns}
              pagination={{
                pageSize: 10,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
