import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Importa tus componentes de forma perezosa (lazy loading)
const Landing = lazy(() => import('@/pages/public/landing'));
const Register = lazy(() => import('@/pages/public/sign-in'));

const Login = lazy(() => import('@/pages/auth/login'));
const ResetPassword = lazy(() => import('@/pages/auth/reset-password'));
const VerifyRegister = lazy(() => import('@/pages/auth/verify-register'));

const PublicPlayground = lazy(() => import('@/pages/private/playground').then(module => ({ default: module.PublicPlayground })));
const PrivatePlayground = lazy(() => import('@/pages/private/playground').then(module => ({ default: module.PrivatePlayground })));

const ProfilePage = lazy(() => import('@/pages/profile/profile'));
const EditProfilePage = lazy(() => import('@/pages/profile/edit-profile'));

const ProblemsPage = lazy(() => import('@/pages/problems/problems-list'));
const ProblemDetailPage = lazy(() => import('@/pages/problems/problem-page'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/dashboard'));
const AdminUsersPage = lazy(() => import('@/pages/admin/users/users-page'));
const AdminUserDetailPage = lazy(() => import('@/pages/admin/users/user-details'));
const NewUserPage = lazy(() => import('@/pages/admin/users/user-new'));

const AdminProblemsPage = lazy(() => import('@/pages/admin/problems/problems-page'));
const NewProblemPage = lazy(() => import('@/pages/admin/problems/problem-new'));
const EditProblemPage = lazy(() => import('@/pages/admin/problems/problem-detail'));

const AdminCommentsPage = lazy(() => import('@/pages/admin/comments/comments-page'));
const NotFound = lazy(() => import('@/pages/public/not-found'));

const routes: RouteObject[] = [
    { path: '/', element: <Landing /> },
    { path: '/playground', element: <PublicPlayground /> },
    { path: '/private', element: <PrivatePlayground /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '/edit-profile', element: <EditProfilePage /> },

    { path: '/auth/login', element: <Login /> },
    { path: '/auth/register', element: <Register /> },
    { path: '/auth/reset-password', element: <ResetPassword /> },
    { path: '/auth/verify-register', element: <VerifyRegister /> },
    
    { path: '/problems', element: <ProblemsPage /> },
    { path: '/problems/:id', element: <ProblemDetailPage /> },

    { path: '/admin/', element: <AdminDashboardPage /> },

    { path: '/admin/users', element: <AdminUsersPage /> },
    { path: '/admin/users/new', element: <NewUserPage /> },
    { path: '/admin/users/:id', element: <AdminUserDetailPage /> },

    { path: '/admin/problems', element: <AdminProblemsPage /> },
    { path: '/admin/problems/new', element: <NewProblemPage /> },
    { path: '/admin/problems/:id', element: <EditProblemPage /> },

    { path: '/admin/comments', element: <AdminCommentsPage /> },
    
    { path: '*', element: <NotFound /> },
];

export default routes;