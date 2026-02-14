import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import Home from "./index.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./components/Auth.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CreateResume from "./components/CreateResume.jsx";
import Home from "./index.jsx";
import path from "path";
import { AuthProvider } from "./components/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState, useEffect } from "react";
// import { ResumeInfoProvider } from "./context/ResumeInfoContext.jsx";




//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [editingResumeId, setEditingResumeId] = useState(null);

// useEffect(() => {
//     const session = localStorage.getItem('auth_session');
//     if (session) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleAuthSuccess = () => {
//     setIsAuthenticated(true);
//     setCurrentPage('landing');
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem('auth_session');
//     localStorage.removeItem('auth_user');
//     setIsAuthenticated(false);
//     navigate('/');
//   };

//   const handleCreateResumeClick = () => {
//       if (isAuthenticated) {
//         setCurrentPage('create');
//       } else {
//         setCurrentPage('auth');
//       }
//     };
  
//     const handleDashboardClick = () => {
//       if (isAuthenticated) {
//         setCurrentPage('dashboard');
//       } else {
//         setCurrentPage('auth');
//       }
//     };




const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "resume/new", element: <CreateResume mode="create"  /> },
          { path: "resume/:id", element: <CreateResume mode="edit" /> },
        ],
      },

]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
