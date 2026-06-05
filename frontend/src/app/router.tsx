import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ROUTES } from '@/constants/routes.constants'
import { DashboardLayout } from '@/layouts/DashboardLayout/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout/AuthLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const SectionList = lazy(() =>
  import('@/features/memberSection/pages/SectionList').then((m) => ({
    default: m.SectionList,
  })),
)
const TownList = lazy(() =>
  import('@/features/memberTown/pages/TownList').then((m) => ({
    default: m.TownList,
  })),
)
const CenterList = lazy(() =>
  import('@/features/memberCenter/pages/CenterList').then((m) => ({
    default: m.CenterList,
  })),
)
const MemberList = lazy(() =>
  import('@/features/member/pages/MemberList').then((m) => ({
    default: m.MemberList,
  })),
)
const MemberCreatePage = lazy(() =>
  import('@/features/member/pages/MemberCreatePage').then((m) => ({default: m.MemberCreatePage,})),
)
const MemberDetailPage = lazy(() =>
  import('@/features/member/pages/MemberDetailPage').then((m) => ({
    default: m.MemberDetailPage,
  })),
)
const PlaceholderPage = lazy(() =>
  import('@/pages/PlaceholderPage').then((m) => ({
    default: m.PlaceholderPage,
  })),
)

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner label="Loading page..." />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.login,
            element: (
              <LazyPage>
                <LoginPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.verifyOtp,
            element: <Navigate to={ROUTES.login} replace />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: ROUTES.dashboard,
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.memberSections,
            element: (
              <LazyPage>
                <SectionList />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.memberTowns,
            element: (
              <LazyPage>
                <TownList />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.memberCenters,
            element: (
              <LazyPage>
                <CenterList />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.members,
            element: (
              <LazyPage>
                <MemberList />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.memberCreate,
            element: (
              <LazyPage>
                <MemberCreatePage />
              </LazyPage>
            ),
          },
          {
            path: '/members/:id',
            element: (
              <LazyPage>
                <MemberDetailPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.users,
            element: (
              <LazyPage>
                <PlaceholderPage
                  title="Users"
                  description="Manage system users and access."
                />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.roles,
            element: (
              <LazyPage>
                <PlaceholderPage
                  title="Roles"
                  description="Configure role definitions."
                />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.permissions,
            element: (
              <LazyPage>
                <PlaceholderPage
                  title="Permissions"
                  description="Fine-grained permission management."
                />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.settings,
            element: (
              <LazyPage>
                <PlaceholderPage
                  title="Settings"
                  description="Application and organization settings."
                />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.dashboard} replace />,
  },
])
