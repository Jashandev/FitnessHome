import React, { useEffect, useState } from "react";
import {
  HomeOutlined,
  IdcardOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  FilterOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import logo from '../assets/logo.png'; // Replace with your custom logo

const Sidebar = (props) => {
  let location = useLocation();
  const { aside, setaside } = props;
  const dispatch = useDispatch();

  // Internal state to track the token and userType from cookies
  const [token, setToken] = useState(Cookies.get('token'));
  const [userType, setUserType] = useState(Cookies.get('userType')); // Assuming you store userType in cookies

  // Effect to monitor token and userType changes in cookies
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = Cookies.get('token');
      const newUserType = Cookies.get('userType');
      
      if (newToken !== token || newUserType !== userType) {
        setToken(newToken);
        setUserType(newUserType);
      }
    }, 1000); // Check every second (you can adjust this)

    return () => clearInterval(interval);
  }, [token, userType]);

  // Navigation configuration
  const navigation = {
    admin: [
      { name: "Dashboard", to: "/Dashboard", current: location.pathname === "/Dashboard", icon: <HomeOutlined /> },
      { name: "Manage Plans", to: "/Dashboard/PlanManagement", current: location.pathname === "/Dashboard/PlanManagement", icon: <FileTextOutlined /> },
      { name: "Manage Managers", to: "/Dashboard/ManagerManagement", current: location.pathname === "/Dashboard/ManagerManagement", icon: <TeamOutlined /> },
      { name: "Manage Trainers", to: "/Dashboard/TrainerManagement", current: location.pathname === "/Dashboard/TrainerManagement", icon: <TeamOutlined /> },
      { name: "Manage Users", to: "/Dashboard/UserManagement", current: location.pathname === "/Dashboard/UserManagement", icon: <UserOutlined /> },
      { name: "Finance Overview", to: "/Dashboard/FinanceData", current: location.pathname === "/Dashboard/FinanceData", icon: <DollarOutlined /> },
      { name: "User Filter", to: "/Dashboard/UserFilterExport", current: location.pathname === "/Dashboard/UserFilterExport", icon: <FilterOutlined /> },
      { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/Attendance"), icon: <CalendarOutlined /> },
      { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/ViewAttendance"), icon: <CalendarOutlined /> },
      { name: "Add Expenses", to: "/Dashboard/AddExpense", current: location.pathname === "/Dashboard/AddExpense", icon: <FileAddOutlined /> },
      { name: "View Expenses", to: "/Dashboard/ViewExpenses", current: location.pathname === "/Dashboard/ViewExpenses", icon: <FileSearchOutlined /> },
      { name: "Assign Plan", to: "/Dashboard/AssignPlan", current: location.pathname === "/Dashboard/AssignPlan", icon: <CreditCardOutlined /> },
      { name: "Upgrade Plan", to: "/Dashboard/UpgradePlan", current: location.pathname === "/Dashboard/UpgradePlan", icon: <CreditCardOutlined /> },
      { name: "Assign Trainer", to: "/Dashboard/AssignTrainer", current: location.pathname === "/Dashboard/AssignTrainer", icon: <TeamOutlined /> },
      { name: "Generate Invoices", to: "/Dashboard/GenerateInvoice", current: location.pathname === "/Dashboard/GenerateInvoice", icon: <FileAddOutlined /> },
      { name: "View Invoices", to: "/Dashboard/ViewInvoices", current: location.pathname === "/Dashboard/ViewInvoices", icon: <FileSearchOutlined /> },
    ],
    manager: [
      { name: "Dashboard", to: "/Dashboard", current: location.pathname === "/Dashboard", icon: <HomeOutlined /> },
      { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/Attendance"), icon: <CalendarOutlined /> },
      { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/ViewAttendance"), icon: <CalendarOutlined /> },
      { name: "Manage Trainers", to: "/Dashboard/TrainerManagement", current: location.pathname === "/Dashboard/TrainerManagement", icon: <TeamOutlined /> },
      { name: "Manage Users", to: "/Dashboard/UserManagement", current: location.pathname === "/Dashboard/UserManagement", icon: <UserOutlined /> },
      { name: "User Filter", to: "/Dashboard/UserFilterExport", current: location.pathname === "/Dashboard/UserFilterExport", icon: <FilterOutlined /> },
      { name: "Assign Plan", to: "/Dashboard/AssignPlan", current: location.pathname === "/Dashboard/AssignPlan", icon: <CreditCardOutlined /> },
      { name: "Assign Trainer", to: "/Dashboard/AssignTrainer", current: location.pathname === "/Dashboard/AssignTrainer", icon: <TeamOutlined /> },
      { name: "Upgrade Plan", to: "/Dashboard/UpgradePlan", current: location.pathname === "/Dashboard/UpgradePlan", icon: <CreditCardOutlined /> },
      { name: "View Expenses", to: "/Dashboard/ViewExpenses", current: location.pathname === "/Dashboard/ViewExpenses", icon: <FileSearchOutlined /> },
      { name: "Generate Invoices", to: "/Dashboard/GenerateInvoice", current: location.pathname === "/Dashboard/GenerateInvoice", icon: <FileAddOutlined /> },
      { name: "View Invoices", to: "/Dashboard/ViewInvoices", current: location.pathname === "/Dashboard/ViewInvoices", icon: <FileSearchOutlined /> },
    ],
    trainer: [
      { name: "Dashboard", to: "/Dashboard", current: location.pathname === "/Dashboard", icon: <HomeOutlined /> },
      { name: "User Filter", to: "/Dashboard/UserFilterExport", current: location.pathname === "/Dashboard/UserFilterExport", icon: <FilterOutlined /> },
      { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/Attendance"), icon: <CalendarOutlined /> },
      { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/ViewAttendance"), icon: <CalendarOutlined /> },
      { name: "Manage Users", to: "/Dashboard/UserManagement", current: location.pathname === "/Dashboard/UserManagement", icon: <UserOutlined /> },
    ],
    user: [
      { name: "Dashboard", to: "/Dashboard", current: location.pathname === "/Dashboard", icon: <HomeOutlined /> },
      { name: "My Plans", to: "/Dashboard/Myplan", current: location.pathname === "/Dashboard/Myplan", icon: <FileTextOutlined /> },
      { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/Attendance"), icon: <CalendarOutlined /> },
      { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, current: location.pathname.includes("/Dashboard/ViewAttendance"), icon: <CalendarOutlined /> },
    ],
  };

  const getLinksForUserType = () => {
    switch (userType) {
      case "1":
        return navigation.admin;
      case "2":
        return navigation.manager;
      case "3":
        return navigation.trainer;
      case "4":
        return navigation.user;
      default:
        return [];
    }
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div
      className={`fixed h-full w-64 text-white transition-all duration-300 z-10 ${aside ? "ml-0" : "md:-ml-48 -ml-64"
        }`}
      style={{ backgroundColor: "rgb(29, 61, 36)", overflowY: 'auto' }} // Scroll enabled on overflow
      onMouseEnter={() => setaside(true)}
      onMouseLeave={() => setaside(false)}
    >
      <div className="flex justify-between items-center p-4">
        <img src={logo} className="h-12 bg-white p-1 rounded-md" alt="Fitness Home Logo" />
        <button className="focus:outline-none" onClick={() => setaside(!aside)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={aside ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      <ul className="flex flex-col w-full font-medium mt-4">
        {getLinksForUserType().map((item) => (
          <Link
            to={item.to}
            onClick={() => setaside(false)}
            key={item.name}
            className={classNames(
              item.current
                ? "text-yellow-500 cursor-default"
                : "hover:bg-green-700 hover:text-yellow-500 text-gray-400",
              "mx-4 rounded-md"
            )}
            aria-current="page"
          >
            <li className="flex justify-between items-center h-12 w-full px-2">
              {item.name}
              {item.icon}
            </li>
          </Link>
        ))}
      </ul>

      <div className="mb-32"></div>
    </div>
  );
};

export default Sidebar;
