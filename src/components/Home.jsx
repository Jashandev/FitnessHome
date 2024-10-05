import React from 'react';
import { Layout, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeOutlined,
  IdcardOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';

const { Content } = Layout;

function Home({ aside }) {
  const { userType } = useSelector((state) => state.Auth);

// Function to get links based on user type
const getLinksForUserType = (userType) => {
  switch (userType) {
    case "1": // Admin
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
    case "2": // Manager
      return [
        { name: "Dashboard", to: "/Dashboard", icon: <HomeOutlined /> },
        { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
        { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
        { name: "Manage Trainers", to: "/Dashboard/TrainerManagement", icon: <TeamOutlined /> },
        { name: "Manage Users", to: "/Dashboard/UserManagement", icon: <UserOutlined /> },
        { name: "User Filter", to: "/Dashboard/UserFilterExport", icon: <FilterOutlined /> },
        { name: "Assign Plan", to: "/Dashboard/AssignPlan", icon: <CreditCardOutlined /> },
        { name: "Assign Trainer", to: "/Dashboard/AssignTrainer", icon: <TeamOutlined /> },
        { name: "Upgrade Plan", to: "/Dashboard/UpgradePlan", icon: <CreditCardOutlined /> },
        { name: "View Expenses", to: "/Dashboard/ViewExpenses", icon: <FileSearchOutlined /> },
        { name: "Generate Invoices", to: "/Dashboard/GenerateInvoice", icon: <FileAddOutlined /> },
        { name: "View Invoices", to: "/Dashboard/ViewInvoices", icon: <FileSearchOutlined /> },
      ];
    case "3": // Trainer
      return [
        { name: "Dashboard", to: "/Dashboard", icon: <HomeOutlined /> },
        { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
        { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
        { name: "Manage Users", to: "/Dashboard/UserManagement", icon: <UserOutlined /> },
      ];
    case "4": // User
      return [
        { name: "Dashboard", to: "/Dashboard", icon: <HomeOutlined /> },
        { name: "My Plans", to: "/Dashboard/Myplan", icon: <FileTextOutlined /> },
        { name: "Mark Attendance", to: `/Dashboard/Attendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
        { name: "View Attendance", to: `/Dashboard/ViewAttendance/${Cookies.get('id')}`, icon: <CalendarOutlined /> },
      ];
    default:
      return [];
  }
};


  // Adjust the margin or width based on the sidebar state
  const contentStyle = {
    padding: '40px',
    transition: 'margin-left 0.3s ease',
    marginLeft: aside ? '120px' : '20px', // Dynamically adjust based on sidebar state
    backgroundColor: '#F0F2F5',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={contentStyle}>
       {/* <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1d3d24' }}>Welcome to Your Dashboard</h2> */}

        {/* Dynamically render cards based on userType */}
        <Row gutter={[24, 24]}>
          {getLinksForUserType().map((item, index) => (
            <Col span={8} key={index}>
              <Link to={item.to}>
                <Card
                  title={item.name}
                  bordered={false}
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFD700',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  bodyStyle={{
                    padding: '20px',
                  }}
                  className="dashboard-card"
                >
                  {item.icon} {` Navigate to ${item.name}`}
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Content>

      <style>
        {`
          .dashboard-card:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </Layout>
  );
}

export default Home;
