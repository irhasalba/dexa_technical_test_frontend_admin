import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { BaseLayout } from './layout/base_layout';
import Home from './pages/Home.tsx';
import "./index.css"
import EmployeeList from './pages/employee/List.tsx';
import EmployeeCreate from './pages/employee/Create.tsx';
import EmployeeEdit from './pages/employee/Edit.tsx';
import Attendance from './pages/Attendance.tsx';
import Login from './pages/Login.tsx';

const router = createBrowserRouter([
  {
    index:true,
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: BaseLayout,
    children: [
      {
        Component: Home,
      },
      {
        path: "employee",
        Component: EmployeeList,
      },
      {
        path: "employee/create",
        Component: EmployeeCreate,
      },
      {
        path: "employee/:id/edit",
        Component: EmployeeEdit,
      },
      {
        path: "attendance",
        Component: Attendance,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
