import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import DemoPage from "@/pages/demo";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ProtectedRoute from "@/components/protected-route";

// App-specific dashboard pages
import NewsDashboardPage from "@/pages/apps/news/dashboard";
import TasksDashboardPage from "@/pages/apps/tasks/dashboard";
import TimeDashboardPage from "@/pages/apps/time/dashboard";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<DemoPage />} path="/demo" />
      <Route element={<LoginPage />} path="/login" />
      {/* Main Dashboard Route */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        path="/dashboard"
      />

      {/* News App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <NewsDashboardPage />
          </ProtectedRoute>
        }
        path="/news/dashboard"
      />

      {/* Task Management App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <TasksDashboardPage />
          </ProtectedRoute>
        }
        path="/task-management/dashboard"
      />

      {/* Time Management App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <TimeDashboardPage />
          </ProtectedRoute>
        }
        path="/time-management/dashboard"
      />
    </Routes>
  );
}

export default App;
