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

const router = createBrowserRouter([
  {
    path: "/",
    Component: BaseLayout,
    children: [
      {
        index: true,
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
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
