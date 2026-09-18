import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AppShell from '../components/layout/AppShell';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

// Placeholder or lazy loaded pages
const HabitsPage = lazy(() => import('../pages/HabitsPage'));
const HabitDetailPage = lazy(() => import('../pages/HabitDetailPage'));
const AICoachPage = lazy(() => import('../pages/AICoachPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="w-8 h-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/habits"
            element={
              <Suspense fallback={<PageLoader />}>
                <HabitsPage />
              </Suspense>
            }
          />
          <Route
            path="/habits/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <HabitDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/ai-coach"
            element={
              <Suspense fallback={<PageLoader />}>
                <AICoachPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
