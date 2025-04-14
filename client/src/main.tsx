import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import FourOFour from "./components/FourOFour.tsx";
import Layout from "./components/Layout.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/auth/login", element: <Login /> },
  {
    path: "/auth",
    element: <ProtectedRouteWrapper />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "dashboard/:view",
        element: <Dashboard />,
      },
    ],
  },
  { path: "*", element: <FourOFour /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Layout>
        <RouterProvider router={router} />
        <ToastContainer />
      </Layout>
    </Provider>
  </StrictMode>
);
