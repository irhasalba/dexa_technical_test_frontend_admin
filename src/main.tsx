import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { BaseLayout } from './layout/base_layout';
import Home from './pages/Home.tsx';
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    Component: BaseLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
