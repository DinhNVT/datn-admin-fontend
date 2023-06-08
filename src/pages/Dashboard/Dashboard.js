import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { HiOutlineUsers } from "react-icons/hi2";
import { FiEdit } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import avtDefault from "../../assets/images/avatar_default.png";
import { Link } from "react-router-dom";
import {
  apiGetCountDashboard,
  apiGetLatestUsers,
  apiGetPostCountByStatus,
  apiGetPostPerDay,
  apiGetUserCountByRole,
} from "../../apis/dashboard";
import { truncateTitle } from "../../utils/truncateString";
import { getCreatedAtString } from "../../utils/convertTime";
import { ACCOUNT_PATH } from "../../routes/routers.constant";
import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [countDashboard, setCountDashboard] = useState(null);
  const [latestUsers, setLatestUsers] = useState([]);
  const [postPerDay, setPostPerDay] = useState([]);
  const [postStatus, setPostStatus] = useState(null);
  const [userCount, setUserCount] = useState(null);

  const getDashboardData = async () => {
    try {
      // const [resCount, resUsers] = await Promise.all([
      //   apiGetCountDashboard(),
      //   apiGetLatestUsers(3),
      // ]);

      // setCountDashboard(resCount.data.data);
      // setLatestUsers(resUsers.data.data);

      const resCountPromise = apiGetCountDashboard();
      const resUsersPromise = apiGetLatestUsers(8);
      const resPostsPerDayPromise = apiGetPostPerDay();
      const resPostStatusPromise = apiGetPostCountByStatus();
      const resRolePromise = apiGetUserCountByRole();

      const resCount = await resCountPromise;
      setCountDashboard(resCount.data.data);

      const resUsers = await resUsersPromise;
      setLatestUsers(resUsers.data.data);

      const resPostsPer = await resPostsPerDayPromise;
      setPostPerDay(resPostsPer.data.data);

      const resPostStatus = await resPostStatusPromise;
      setPostStatus(resPostStatus.data.data);

      const resRole = await resRolePromise;
      setUserCount(resRole.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Số lượng bài viết mỗi ngày",
      },
    },
    // interaction: {
    //   intersect: false,
    // },
    // scales: {
    //   x: {
    //     display: true,
    //     title: {
    //       display: true,
    //     },
    //   },
    //   y: {
    //     display: true,
    //     title: {
    //       display: true,
    //       text: "Value",
    //     },
    //     suggestedMin: -10,
    //     suggestedMax: 3,
    //   },
    // },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="right">
          <div className="top">
            <div className="card user-container">
              <div className="text">
                <h1>{countDashboard?.userCount}</h1>
                <h3>Tài khoản</h3>
              </div>
              <div className="icon-container icon-user">
                <HiOutlineUsers className={"icon "} />
              </div>
            </div>
            <div className="card post-container">
              <div className="text">
                <h1>{countDashboard?.postCount}</h1>
                <h3>Bài viết</h3>
              </div>
              <div className="icon-container icon-post">
                <FiEdit className={"icon-post"} />
              </div>
            </div>
            <div className="card category-container">
              <div className="text">
                <h1>{countDashboard?.categoryPostCount}</h1>
                <h3>Danh mục</h3>
              </div>
              <div className="icon-container icon-category">
                <MdOutlineCategory className={"icon "} />
              </div>
            </div>
            <div className="card comment-container">
              <div className="text">
                <h1>
                  {countDashboard?.commentCount +
                    countDashboard?.subCommentCount}
                </h1>
                <h3>Bình luận</h3>
              </div>
              <div className="icon-container icon-comment">
                <FaRegComment className={"icon "} />
              </div>
            </div>
          </div>
          <div className="bottom">
            <h1 className="title">Bài viết hàng ngày</h1>
            <div className="chart-container">
              <Line
                options={options}
                data={{
                  labels: postPerDay.map((post) => post.date).reverse(),
                  datasets: [
                    {
                      label: "Số lượng bài viết",
                      data: postPerDay.map((post) => post.count).reverse(),
                      borderColor: "#00c491",
                      backgroundColor: "#2EE5B4",
                      fill: false,
                      tension: 0.4,
                      pointStyle: "circle",
                      pointRadius: 10,
                      pointHoverRadius: 15,
                    },
                    // {
                    //   label: "Dataset 2",
                    //   data: [1, 2, 3, 4, 9, 6, 7],
                    //   borderColor: "rgb(53, 162, 235)",
                    //   backgroundColor: "rgba(53, 162, 235, 0.5)",
                    // },
                  ],
                }}
              />
              ;
            </div>
          </div>
        </div>
        <div className="left">
          <h2>Tài khoản mới</h2>
          <div className="account-list">
            {latestUsers.length >= 0 &&
              latestUsers.map((latestUser, index) => (
                <div key={latestUser._id} className="account-item">
                  <div className="right-account-item">
                    <img
                      className="avt"
                      src={latestUser.avatar ? latestUser.avatar : avtDefault}
                      alt=""
                    />
                    <div className="text">
                      <h3>{truncateTitle(latestUser.name, 20)}</h3>
                      <p>{getCreatedAtString(latestUser.createdAt)}</p>
                    </div>
                  </div>
                  <div className="left-account-item">
                    <p
                      className={`tag ${
                        latestUser.roleId?.name === "admin" ? "admin" : "user"
                      }`}
                    >{`${latestUser?.roleId?.name?.toUpperCase()}`}</p>
                  </div>
                </div>
              ))}
            <Link to={ACCOUNT_PATH.LIST} className="see-all">
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>
      <div className="dashboard-footer">
        <div className="right">
          <h3 className="title">Phân tích bài viết</h3>
          <div className="right-container">
            <div className="chart">
              <Pie
                width={300}
                height={300}
                type="doughnut"
                data={{
                  labels: ["Công khai", "Nháp", "Bị chặn"],
                  datasets: [
                    {
                      label: "Số bài viết",
                      data: [
                        postStatus?.published,
                        postStatus?.draft,
                        postStatus?.blocked,
                      ],
                      backgroundColor: ["#32D583", "#FDB022", "#F97066"],
                      borderColor: "#fff",
                      // borderColor: [
                      //   "rgba(255, 99, 132, 1)",
                      //   "rgba(54, 162, 235, 1)",
                      //   "rgba(255, 206, 86, 1)",
                      // ],
                      borderWidth: 2,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
        <div className="left">
          <h3 className="title">Phân tích tài khoản</h3>
          <div className="left-container">
            <div className="chart">
              <Doughnut
                width={300}
                height={300}
                type="doughnut"
                data={{
                  labels: ["Admin", "User"],
                  datasets: [
                    {
                      label: "Số tài khoản",
                      data: [userCount?.admin, userCount?.user],
                      backgroundColor: ["#55F4A5", "#3A8AE4"],
                      borderColor: ["#1DB86B", "#1961B2"],
                      borderWidth: 3,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
