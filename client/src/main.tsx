import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import FourOFour from "./components/FourOFour.tsx";
import Layout from "./components/Layout.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth/dashboard", element: <Dashboard /> },
  { path: "*", element: <FourOFour /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </StrictMode>
);
