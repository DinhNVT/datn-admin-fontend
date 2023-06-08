import React, { useEffect, useState } from "react";
import "./CategoryList.scss";
import { Breadcrumb, Table } from "antd";
import { getCreatedAtString } from "../../../utils/convertTime";
import {
  apiCreateCategory,
  apiDeleteCategory,
  apiGetAllCategories,
  apiUpdateCategory,
} from "../../../apis/category";
import { TbEye, TbEdit, TbTrash } from "react-icons/tb";
import Loader from "../../../components/Loader/Loader";
import {
  deleteAlert,
  errorAlert,
  successAlert,
} from "../../../utils/customAlert";
import { HOME_PATH } from "../../../routes/routers.constant";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";
import CategoryView from "../CategoryView/CategoryView";
import { MdOutlineClose } from "react-icons/md";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("create");
  const [categoryUpdate, setCategoryUpdate] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [isShowModalView, setIsShowModalView] = useState(false);
  const [categoryIdView, setCategoryIdView] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);

  const closeModalView = () => {
    setIsShowModalView(false);
  };

  const openModalView = () => {
    setIsShowModalView(true);
  };

  const getAllCategories = async () => {
    setIsLoadingData(true);
    try {
      const res = await apiGetAllCategories();
      if (res.data.categories.length >= 0) {
        const modifiedCategories = res.data.categories.map((category) => {
          return { ...category, key: category._id };
        });
        setCategories(modifiedCategories);
      }
      setIsLoadingData(false);
    } catch (error) {
      console.log(error);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setDescription(description);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      sorter: (a, b) => a.slug.localeCompare(b.slug),
    },
    {
      title: "Bài viết",
      dataIndex: "posts",
      render: (posts) => <span>{posts.length}</span>,
      sorter: (a, b) => a.posts.length - b.posts.length,
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
              openModalView();
              setCategoryIdView(_id);
            }}
            className="icon icon-view"
          />
          <TbEdit
            onClick={() => {
              handleEditCategory(_id);
            }}
            className="icon icon-edit"
          />
          <TbTrash
            onClick={() => {
              handleOnClickDeleteCategory(_id);
            }}
            className="icon icon-delete"
          />
        </div>
      ),
    },
  ];

  const handleOnClickDeleteCategory = (id) => {
    const selectedCategory = categories.find((category) => category._id === id);
    if (selectedCategory) {
      if (selectedCategory.posts.length > 0) {
        errorAlert("Bạn không được phép xóa", "Danh mục này đã có bài viết");
      } else {
        const confirmDelete = () => {
          return apiDeleteCategory(id);
        };

        deleteAlert(
          "Xóa danh mục",
          "Sau khi bạn xóa thì không thể hoàn tác",
          confirmDelete,
          getAllCategories
        );
      }
    }
  };

  const handleCreateCategory = async () => {
    setIsLoading(true);
    try {
      await apiCreateCategory({ name: name, description: description });
      getAllCategories();
      successAlert("Đã thêm danh mục thành công");
      setIsLoading(false);
      setName("");
      setDescription("");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAlert("Đã xảy ra lỗi", "Vui lòng thử lại sau");
    }
  };

  const cancelOnclick = () => {
    setStatus("create");
    setName("");
    setDescription("");
    setCategoryUpdate(null);
  };

  const handleEditCategory = (categoryId) => {
    const selectedCategory = categories.find(
      (category) => category._id === categoryId
    );
    if (selectedCategory) {
      setStatus("update");
      setName(selectedCategory.name);
      setDescription(selectedCategory.description);
      setCategoryUpdate(selectedCategory);
    }
  };

  const handleUpdateCategory = async () => {
    setIsLoading(true);
    try {
      await apiUpdateCategory(categoryUpdate._id, {
        name: name,
        description: description,
      });
      getAllCategories();
      successAlert("Đã cập nhật danh mục thành công");
      setIsLoading(false);
      setName("");
      setDescription("");
      setStatus("create");
      setCategoryUpdate(null);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAlert("Đã xảy ra lỗi", "Vui lòng thử lại sau");
    }
  };

  const handleSearch = () => {
    const filteredCategories = categories.filter((category) => {
      const nameMatch = category.name
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const descriptionMatch = category.description
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const slugMatch = category.slug
        .toLowerCase()
        .includes(keyword.toLowerCase());
      return nameMatch || descriptionMatch || slugMatch;
    });

    return filteredCategories;
  };
  return (
    <div className="category-list-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Danh sách danh mục</h1>
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
                  title: "Danh mục",
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
                placeholder="Tìm kiếm danh mục..."
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
      <div className="category-content">
        <div className="add-edit-category">
          <h3 className="title">
            {status === "update" ? "Sửa danh mục" : "Tạo danh mục"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (status === "update") {
                handleUpdateCategory();
              } else if (status === "create") {
                handleCreateCategory();
              }
            }}
          >
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
                    autoComplete="off"
                  />
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
              </label>
            </p>
            <div className="btn-category">
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
                  "Tạo Danh Mục"
                ) : (
                  "Lưu"
                )}
              </button>
            </div>
          </form>
        </div>
        {categories.length >= 0 && (
          <div className="table">
            <Table
              dataSource={handleSearch()}
              columns={columns}
              loading={isLoadingData}
              pagination={{
                pageSize: 10,
              }}
            />
          </div>
        )}
        {isShowModalView && (
          <CategoryView
            isShowModal={isShowModalView}
            closeModal={closeModalView}
            id={categoryIdView}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryList;
