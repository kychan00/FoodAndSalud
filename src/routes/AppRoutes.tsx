import { lazy, Suspense, type ReactNode } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { RouteLoading } from "../components/ui/RouteLoading";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";

const LoginPage = lazy(() =>
  import("../features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);

const SignUpPage = lazy(() =>
  import("../features/auth/pages/SignUpPage").then((module) => ({
    default: module.SignUpPage,
  })),
);

const CheckEmailPage = lazy(() =>
  import("../features/auth/pages/CheckEmailPage").then((module) => ({
    default: module.CheckEmailPage,
  })),
);

const ForgotPasswordPage = lazy(() =>
  import("../features/auth/pages/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);

const ResetPasswordPage = lazy(() =>
  import("../features/auth/pages/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  })),
);

const TodayPage = lazy(() =>
  import("../features/today/pages/TodayPage").then((module) => ({
    default: module.TodayPage,
  })),
);

const CalendarPage = lazy(() =>
  import("../features/calendar/pages/CalendarPage").then((module) => ({
    default: module.CalendarPage,
  })),
);

const PatternsPage = lazy(() =>
  import("../features/patterns/pages/PatternsPage").then((module) => ({
    default: module.PatternsPage,
  })),
);

const FoodDetailPage = lazy(() =>
  import("../features/patterns/pages/FoodDetailPage").then((module) => ({
    default: module.FoodDetailPage,
  })),
);

const PatternLabPage = import.meta.env.DEV
  ? lazy(() =>
      import("../features/patterns/pages/PatternLabPage").then((module) => ({
        default: module.PatternLabPage,
      })),
    )
  : null;

const PatternLabFoodDetailPage = import.meta.env.DEV
  ? lazy(() =>
      import("../features/patterns/pages/PatternLabFoodDetailPage").then(
        (module) => ({
          default: module.PatternLabFoodDetailPage,
        }),
      ),
    )
  : null;

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LazyPage>
              <LoginPage />
            </LazyPage>
          }
        />

        <Route
          path="/signup"
          element={
            <LazyPage>
              <SignUpPage />
            </LazyPage>
          }
        />

        <Route
          path="/check-email"
          element={
            <LazyPage>
              <CheckEmailPage />
            </LazyPage>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <LazyPage>
              <ForgotPasswordPage />
            </LazyPage>
          }
        />

        <Route
          path="/reset-password"
          element={
            <LazyPage>
              <ResetPasswordPage />
            </LazyPage>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <LazyPage>
                <TodayPage />
              </LazyPage>
            }
          />

          <Route
            path="/calendar"
            element={
              <LazyPage>
                <CalendarPage />
              </LazyPage>
            }
          />

          <Route
            path="/patterns"
            element={
              <LazyPage>
                <PatternsPage />
              </LazyPage>
            }
          />

          <Route
            path="/patterns/food/:foodId"
            element={
              <LazyPage>
                <FoodDetailPage />
              </LazyPage>
            }
          />

          <Route
            path="/qa/patterns"
            element={
              import.meta.env.DEV && PatternLabPage ? (
                <LazyPage>
                  <PatternLabPage />
                </LazyPage>
              ) : (
                <Navigate to="/patterns" replace />
              )
            }
          />

          <Route
            path="/qa/patterns/:scenarioId/food/:foodId"
            element={
              import.meta.env.DEV && PatternLabFoodDetailPage ? (
                <LazyPage>
                  <PatternLabFoodDetailPage />
                </LazyPage>
              ) : (
                <Navigate to="/patterns" replace />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
