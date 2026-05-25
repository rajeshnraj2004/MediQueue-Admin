import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLoginPage from './Pages/AdminLoginPage'
import AdminHomePage from './Pages/AdminHomePage'
import AdminAnalyticsPage from './Pages/AdminAnalyticsPage'

// Redirects to login if no token is found
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("Admin_Token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route
          path="/AdminHomePage"
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}
