import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Pages
import SignInPage from "./pages/auth/SignInPage/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage/SignUpPage";
import DashboardPage from "./pages/dashboard/DashboardPage/DashboardPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage/ResetPasswordPage";
// import SprintsPage from "./pages/Sprints/SprintsPage";

import ProfilePage from "./pages/profile/ProfilePage";
// Styles
import "./App.css";
import SprintsPageWrapper from "./pages/Sprints/SprintsPageWrapper";
import TaskPageWrapper from "./pages/TaskPage/TaskPageWrapper";
import ProductBacklogPage from "./pages/ProductBacklog/ProductBaclogPage";


// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
    
      {/* Auth Routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Password Recovery Routes */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* OAuth Callback Route */}
      <Route
        path="/oauth-success"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:projectId/sprints"
        element={
          <ProtectedRoute>
            <SprintsPageWrapper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:projectId/sprints/:sprintId/tasks"
        element={
          <ProtectedRoute>
            <TaskPageWrapper />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:projectId/backlog"
        element={
          <ProtectedRoute>
            <ProductBacklogPage />
          </ProtectedRoute>
        }
      />

      {/* Default route */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
