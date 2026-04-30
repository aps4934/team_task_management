import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectTasks from './pages/ProjectTasks';
import MyTasks from './pages/MyTasks';
import { Toaster } from 'react-hot-toast';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
          <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Projects />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId/tasks"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ProjectTasks />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <AppShell>
                  <MyTasks />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
