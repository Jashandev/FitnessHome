import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import Error from './components/Error';
import ForgotPwd from './components/ForgotPwd';
import ResetPassword from './components/ResetPwd';
import PlanManagement from './components/PlanManagement';
import Home from './components/Home';
import Attendance from './components/Attendance';
import ViewAttendance from './components/ViewAttendance';
import TrainerManagement from './components/TrainerManagement';
import AddExpense from './components/AddExpense';
import ViewExpenses from './components/ViewExpenses';
import AssignPlan from './components/AssignPlan';
import AssignTrainer from './components/AssignTrainer';
import UpgradePlan from './components/UpgradePlan';
import GenerateInvoice from './components/GenerateInvoice';
import UserManagement from './components/UserManagement';
import ManagerManagement from './components/ManagerManagement';
import ViewInvoices from './components/ViewInvoices';
import FinanceData from './components/FinanceDataComponent';
import UserFilterExport from './components/UserFilterExport';
import Myplan from './components/myplan';

const router = createBrowserRouter([
  {
    path: "/Dashboard",
    element: (
      <PrivateRoute component={DashboardLayout} />
    ),
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "PlanManagement",
        element: <PlanManagement />,
      },
      {
        path: "Attendance/:id",
        element: <Attendance />,
      },
      {
        path: "ViewAttendance/:id",
        element: <ViewAttendance />,
      },
      {
        path: "AddExpense",
        element: <AddExpense />,
      },
      {
        path: "ViewExpenses",
        element: <ViewExpenses />,
      },
      {
        path: "ManagerManagement",
        element: <ManagerManagement />,
      },
      {
        path: "UserManagement",
        element: <UserManagement />,
      },
      {
        path: "TrainerManagement",
        element: <TrainerManagement />,
      },
      {
        path: "AssignPlan",
        element: <AssignPlan />,
      },
      {
        path: "AssignTrainer",
        element: <AssignTrainer />,
      },
      {
        path: "UpgradePlan",
        element: <UpgradePlan />,
      },
      {
        path: "GenerateInvoice",
        element: <GenerateInvoice />,
      },
      {
        path: "FinanceData",
        element: <FinanceData />,
      },
      {
        path: "ViewInvoices",
        element: <ViewInvoices />,
      },
      
      {
        path: "UserFilterExport",
        element: <UserFilterExport />,
      },
      {
        path: "Myplan",
        element: <Myplan />,
      },
    ],
  },
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/ForgotPwd",
    element: <ForgotPwd />,
    errorElement: <Error />,
  },
  {
    path: "/reset/:token",
    element: <ResetPassword />,
    errorElement: <Error />,
  },
]);

export default router;