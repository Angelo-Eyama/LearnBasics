import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Importa tus componentes de forma perezosa (lazy loading)
const Landing = lazy(() => import('@/pages/public/landing'));
const Login = lazy(() => import('@/pages/public/login'));
const Register = lazy(() => import('@/pages/public/sign-in'));
const Home = lazy(() => import('@/pages/private/home'));
const PublicPlayground = lazy(() => import('@/pages/private/playground').then(module => ({ default: module.PublicPlayground })));
const PrivatePlayground = lazy(() => import('@/pages/private/playground').then(module => ({ default: module.PrivatePlayground })));
const ProfilePage = lazy(() => import('@/pages/users/profile'));
const EditProfilePage = lazy(() => import('@/pages/users/edit-profile'));
const ProblemsPage = lazy(() => import('@/pages/problems/problems-list'));
const ProblemDetailPage = lazy(() => import('@/pages/problems/problem-page'));
const UserListPage = lazy(() => import('@/pages/admin/users/users-page'));
const UserDetailPage = lazy(() => import('@/pages/admin/users/user-details'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/dashboard'));
const AdminUsersPage = lazy(() => import('@/pages/admin/users/users-page'));
const AdminUserDetailPage = lazy(() => import('@/pages/admin/users/user-details'));
const AdminProblemsPage = lazy(() => import('@/pages/admin/problems/problems-page'));
const NewProblemPage = lazy(() => import('@/pages/admin/problems/problem-new'));
const AdminCommentsPage = lazy(() => import('@/pages/admin/comments/comments-page'));
const NotFound = lazy(() => import('@/pages/public/not-found'));

const routes: RouteObject[] = [
    { path: '/', element: <Landing /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/home', element: <Home /> },
    { path: '/playground', element: <PublicPlayground /> },
    { path: '/private', element: <PrivatePlayground /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '/edit-profile', element: <EditProfilePage /> },
    { path: '/problems', element: <ProblemsPage /> },
    { path: '/problems/:id', element: <ProblemDetailPage /> },
    { path: '/admin/users', element: <UserListPage /> },
    { path: '/admin/users/:id', element: <UserDetailPage /> },
    { path: '/admin/', element: <AdminDashboardPage /> },
    { path: '/admin/users', element: <AdminUsersPage /> },
    { path: '/admin/users/:id', element: <AdminUserDetailPage /> },
    { path: '/admin/problems', element: <AdminProblemsPage /> },
    { path: '/admin/problems/new', element: <NewProblemPage /> },
    { path: '/admin/comments', element: <AdminCommentsPage /> },
    { path: '*', element: <NotFound /> },
];

export default routes;