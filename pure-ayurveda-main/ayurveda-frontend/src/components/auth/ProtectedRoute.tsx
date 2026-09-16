import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if the token exists in localStorage
  const token = localStorage.getItem("token");

  // If there is no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the token exists, allow access to the "Outlet" (the child components)
  return <Outlet />;
};

export default ProtectedRoute;