import Login from "../sign-in";
import Dashboard from "../dashboard";
import loginData from "../../data/signin.json";
import resetPasswordData from "../../data/resetPasswordData.json";
import Ledger from "../tasks";
import Departments from "../departments";
import Employees from "../employees";
import Projects from "../projects";
import ResetPassword from "../resetPassword";
import { Navigate } from "react-router-dom";
import EmployeeDetails from "../employees/employeeDetails";
import employeeDetailsData from "../../data/employeeDetailsData.json";
import Profile from "../profile";
import TasksBoard from "../tasks-board";
import Balance from "../agentBalance";
import CreateData from "../data/CreateData";
import GetData from "../data/GetData";
import Requests from "../teamLead/Requests";
import AddAmount from "../teamLead/AddAmount";
import Form from "../form/Form";

export const allRoutes = [
  {
    path: "/login",
    element: <Login {...loginData} />,
  },
  {
    path: "/balancetl",
    element: <AddAmount {...loginData} />,
  },
  {
    path: "/requeststl",
    element: <Requests {...loginData} />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword {...resetPasswordData} />,
  },
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/tasks",
    element: <Ledger />,
  },
  {
    path: "/tasks/board/:id",
    element: <TasksBoard />,
  },
  {
    path: "/departments",
    element: <Departments />,
  },
  {
    path: "/employees",
    element: <Employees />,
  },
  {
    path: "/employees/:id",
  element: <EmployeeDetails {...employeeDetailsData} />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/balance",
    element: <Balance />,
  },
  {
    path: "/form",
    element: <Form />,
  },
  {
    path: "/*",
    element: <Navigate to="/" />,
  },
];
