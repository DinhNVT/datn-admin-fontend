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
  const [countDashboardLoading, setCountDashboardLoading] = useState(false);
  const [isFetchCountDashboard, setIsFetchCountDashboard] = useState(true);

  const [latestUsers, setLatestUsers] = useState([]);
  const [latestUsersLoading, setLatestUsersLoading] = useState(false);
  const [isFetchLatestUsers, setIsFetchLatestUsers] = useState(true);

  const [postPerDay, setPostPerDay] = useState([]);
  const [postPerDayLoading, setPostPerDayLoading] = useState(false);
  const [isFetchPostPerDay, setIsFetchPostPerDay] = useState(true);

  const [postStatus, setPostStatus] = useState(null);
  const [postStatusLoading, setPostStatusLoading] = useState(false);
  const [isFetchPostStatus, setIsFetchPostStatus] = useState(true);

  const [userCount, setUserCount] = useState(null);
  const [userCountLoading, setUserCountLoading] = useState(false);
  const [isFetchUserCount, setIsFetchUserCount] = useState(true);

  const getCountDashboardData = async () => {
    try {
      setCountDashboardLoading(true);
      const resCount = await apiGetCountDashboard();
      setCountDashboard(resCount.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setCountDashboardLoading(false);
      setIsFetchCountDashboard(false);
    }
  };

  const GetLatestUsersData = async () => {
    try {
      setLatestUsersLoading(true);
      const resUsers = await apiGetLatestUsers(8);
      setLatestUsers(resUsers.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLatestUsersLoading(false);
      setIsFetchLatestUsers(false);
    }
  };

  const GetPostPerDayData = async () => {
    try {
      setPostPerDayLoading(true);
      const resPostsPer = await apiGetPostPerDay(8);
      setPostPerDay(resPostsPer.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setPostPerDayLoading(false);
      setIsFetchPostPerDay(false);
    }
  };

  const GetPostStatusData = async () => {
    try {
      setPostStatusLoading(true);
      const resPostStatus = await apiGetPostCountByStatus(8);
      setPostStatus(resPostStatus.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setPostStatusLoading(false);
      setIsFetchPostStatus(false);
    }
  };

  const getUserCountData = async () => {
    try {
      setUserCountLoading(true);
      const resRole = await apiGetUserCountByRole();
      setUserCount(resRole.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setUserCountLoading(false);
      setIsFetchUserCount(false);
    }
  };

  useEffect(() => {
    getCountDashboardData();
    GetLatestUsersData();
    GetPostPerDayData();
    GetPostStatusData();
    getUserCountData();
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
              {!isFetchCountDashboard && (
                <>
                  <div className="text">
                    <h1>
                      {countDashboard?.userCount
                        ? countDashboard?.userCount
                        : "0"}
                    </h1>
                    <h3>Tài khoản</h3>
                  </div>
                  <div className="icon-container icon-user">
                    <HiOutlineUsers className={"icon "} />
                  </div>
                </>
              )}
              {(countDashboardLoading || isFetchCountDashboard) && (
                <>
                  <div>
                    <div className="count skeleton"></div>
                    <div className="label skeleton"></div>
                  </div>
                  <div className="icon-container icon-user skeleton"></div>
                </>
              )}
            </div>
            <div className="card post-container">
              {!isFetchCountDashboard && (
                <>
                  <div className="text">
                    <h1>
                      {countDashboard?.postCount
                        ? countDashboard?.postCount
                        : "0"}
                    </h1>
                    <h3>Bài viết</h3>
                  </div>
                  <div className="icon-container icon-post">
                    <FiEdit className={"icon-post"} />
                  </div>
                </>
              )}
              {(countDashboardLoading || isFetchCountDashboard) && (
                <>
                  <div>
                    <div className="count skeleton"></div>
                    <div className="label skeleton"></div>
                  </div>
                  <div className="icon-container icon-user skeleton"></div>
                </>
              )}
            </div>
            <div className="card category-container">
              {!isFetchCountDashboard && (
                <>
                  <div className="text">
                    <h1>
                      {countDashboard?.categoryPostCount
                        ? countDashboard?.categoryPostCount
                        : "0"}
                    </h1>
                    <h3>Danh mục</h3>
                  </div>
                  <div className="icon-container icon-category">
                    <MdOutlineCategory className={"icon "} />
                  </div>
                </>
              )}
              {(countDashboardLoading || isFetchCountDashboard) && (
                <>
                  <div>
                    <div className="count skeleton"></div>
                    <div className="label skeleton"></div>
                  </div>
                  <div className="icon-container icon-user skeleton"></div>
                </>
              )}
            </div>
            <div className="card comment-container">
              {!isFetchCountDashboard && (
                <>
                  <div className="text">
                    <h1>
                      {countDashboard?.commentCount &&
                      countDashboard?.subCommentCount
                        ? countDashboard?.commentCount +
                          countDashboard?.subCommentCount
                        : "0"}
                    </h1>
                    <h3>Bình luận</h3>
                  </div>
                  <div className="icon-container icon-comment">
                    <FaRegComment className={"icon "} />
                  </div>
                </>
              )}
              {(countDashboardLoading || isFetchCountDashboard) && (
                <>
                  <div>
                    <div className="count skeleton"></div>
                    <div className="label skeleton"></div>
                  </div>
                  <div className="icon-container icon-user skeleton"></div>
                </>
              )}
            </div>
          </div>
          <div className="bottom">
            <h1 className="title">Bài viết hàng ngày</h1>
            <div className="chart-container">
              {postPerDay.length > 0 && !isFetchPostPerDay && (
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
              )}
              {postPerDay.length <= 0 && !isFetchPostPerDay && (
                <p className="not-found-post-per-day">Không có dữ liệu</p>
              )}
              {(postPerDayLoading || isFetchPostPerDay) && (
                <div className="chart-skeleton">
                  <div className="title skeleton"></div>
                  <div className="label">
                    <div className="left-label skeleton"></div>
                    <div className="right-label skeleton"></div>
                  </div>
                  <div className="chart-content">
                    <div className="x-axis">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="x-axis-item skeleton"></div>
                      ))}
                    </div>
                    <div className="chart skeleton"></div>
                  </div>
                  <div className="y-axis">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="y-axis-item skeleton"></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="left">
          <h2>Tài khoản mới</h2>
          <div className="account-list">
            {latestUsers.length > 0 &&
              !isFetchLatestUsers &&
              latestUsers.map((latestUser, index) => (
                <div key={latestUser?._id} className="account-item">
                  <div className="right-account-item">
                    <img
                      className="avt"
                      src={latestUser?.avatar ? latestUser?.avatar : avtDefault}
                      alt=""
                    />
                    <div className="text">
                      <h3>{truncateTitle(latestUser?.name, 20)}</h3>
                      <p>{getCreatedAtString(latestUser?.createdAt)}</p>
                    </div>
                  </div>
                  <div className="left-account-item">
                    <p
                      className={`tag ${
                        latestUser?.roleId?.name === "admin" ? "admin" : "user"
                      }`}
                    >{`${latestUser?.roleId?.name?.toUpperCase()}`}</p>
                  </div>
                </div>
              ))}
            {latestUsers.length <= 0 && !isFetchLatestUsers && (
              <p className="not-found-user">Không có user nào cả</p>
            )}
            {(latestUsersLoading || isFetchLatestUsers) &&
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="account-item">
                  <div className="right-account-item">
                    <div className="avt skeleton"></div>
                    <div className="text">
                      <div className="name skeleton"></div>
                      <div className="time skeleton"></div>
                    </div>
                  </div>
                  <div className="left-account-item">
                    <div className="tag skeleton"></div>
                  </div>
                </div>
              ))}
            {latestUsers.length > 0 && !isFetchLatestUsers && (
              <Link to={ACCOUNT_PATH.LIST} className="see-all">
                Xem tất cả
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="dashboard-footer">
        <div className="right">
          <h3 className="title">Phân tích bài viết</h3>
          <div className="right-container">
            <div className="chart">
              {postStatus && !isFetchPostStatus && (
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
              )}
              {!postStatus && !isFetchLatestUsers && (
                <p className="not-found-text">Không có dữ liệu</p>
              )}
              {(postStatusLoading || isFetchPostStatus) && (
                <div className="chart-skeleton">
                  <div className="label">
                    <div className="shape skeleton"></div>
                    <div className="text skeleton"></div>
                    <div className="shape skeleton"></div>
                    <div className="text skeleton"></div>
                  </div>
                  <div className="circle skeleton"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="left">
          <h3 className="title">Phân tích tài khoản</h3>
          <div className="left-container">
            <div className="chart">
              {userCount && !isFetchUserCount && (
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
              )}
              {!userCount && !isFetchUserCount && (
                <p className="not-found-text">Không có dữ liệu</p>
              )}
              {(userCountLoading || isFetchUserCount) && (
                <div className="chart-skeleton">
                  <div className="label">
                    <div className="shape skeleton"></div>
                    <div className="text skeleton"></div>
                    <div className="shape skeleton"></div>
                    <div className="text skeleton"></div>
                  </div>
                  <div className="circle skeleton"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
