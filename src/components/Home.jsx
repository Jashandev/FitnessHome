import React from 'react';
import { Layout, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeOutlined,
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
import Cookies from 'js-cookie';

const { Content } = Layout;

function Home({ aside }) {
  const { userType } = useSelector((state) => state.Auth);

  // Function to get the links based on userType
  const getLinksForUserType = (userType) => {
    switch (userType) {
      case "1": // Admin User
        return [
          { name: "Dashboard", to: "/Dashboard", icon: <HomeOutlined /> },
          { name: "Manage Plans", to: "/Dashboard/PlanManagement", icon: <FileTextOutlined /> },
          { name: "Manage Managers", to: "/Dashboard/ManagerManagement", icon: <TeamOutlined /> },
          { name: "Manage Trainers", to: "/Dashboard/TrainerManagement", icon: <TeamOutlined /> },
          { name: "Manage Users", to: "/Dashboard/UserManagement", icon: <UserOutlined /> },
          { name: "Finance Overview", to: "/Dashboard/FinanceData", icon: <DollarOutlined /> },
          { name: "User Filter", to: "/Dashboard/UserFilterExport", icon: <FilterOutlined /> },
          { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
          { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
          { name: "Add Expenses", to: "/Dashboard/AddExpense", icon: <FileAddOutlined /> },
          { name: "View Expenses", to: "/Dashboard/ViewExpenses", icon: <FileSearchOutlined /> },
          { name: "Assign Plan", to: "/Dashboard/AssignPlan", icon: <CreditCardOutlined /> },
          { name: "Upgrade Plan", to: "/Dashboard/UpgradePlan", icon: <CreditCardOutlined /> },
          { name: "Assign Trainer", to: "/Dashboard/AssignTrainer", icon: <TeamOutlined /> },
          { name: "Generate Invoices", to: "/Dashboard/GenerateInvoice", icon: <FileAddOutlined /> },
          { name: "View Invoices", to: "/Dashboard/ViewInvoices", icon: <FileSearchOutlined /> },
        ];
      case "2": // Manager User
        return [
          { name: "Dashboard", to: "/Dashboard", icon: <HomeOutlined /> },
          { name: "Manage Trainers", to: "/Dashboard/TrainerManagement", icon: <TeamOutlined /> },
          { name: "Manage Users", to: "/Dashboard/UserManagement", icon: <UserOutlined /> },
          { name: "User Filter", to: "/Dashboard/UserFilterExport", icon: <FilterOutlined /> },
          { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
          { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
          { name: "Add Expenses", to: "/Dashboard/AddExpense", icon: <FileAddOutlined /> },
          { name: "View Expenses", to: "/Dashboard/ViewExpenses", icon: <FileSearchOutlined /> },
          { name: "Generate Invoices", to: "/Dashboard/GenerateInvoice", icon: <FileAddOutlined /> },
          { name: "View Invoices", to: "/Dashboard/ViewInvoices", icon: <FileSearchOutlined /> },
        ];
      case "3": // Trainer User
        return [
          { name: "Dashboard", to: "/Dashboard", icon: <HomeOutlined /> },
          { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
          { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
          { name: "Manage Users", to: "/Dashboard/UserManagement", icon: <UserOutlined /> },
        ];
      case "4": // Normal User
        return [
          { name: "Dashboard", to: "/Dashboard", icon: <HomeOutlined /> },
          { name: "My Plans", to: "/Dashboard/MyPlan", icon: <FileTextOutlined /> },
          { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
          { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
        ];
      default:
        return [];
    }
  };

  return (
    <Layout className="min-h-screen h-full">
      <Content className={`transition-all duration-300 ease-in-out ${aside ? 'ml-32' : 'ml-5'} p-5 h-full`}>
        <Row gutter={[24, 24]} className="w-full justify-center">
          {getLinksForUserType(userType).map((item, index) => (
            <Col 
              key={index} 
              xs={24} sm={12} md={8} lg={6} 
              className="flex justify-center"
            >
              <Link to={item.to} className="w-full">
                <Card
                  bordered={false}
                  className="rounded-lg bg-yellow-400 text-center cursor-pointer shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-200 ease-in-out w-full max-w-xs"
                  bodyStyle={{ padding: '20px', height: 'auto' }} // Adjust the height dynamically
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="font-medium text-lg">{item.name}</div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
}

export default Home;
