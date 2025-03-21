import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/nav-bar';
import Footer from '@/components/footer';
import Landing from '@/pages/public/landing';
import Login from '@/pages/public/login';
import Home from '@/pages/private/home';
import Register from '@/pages/public/sign-in';
import NotFound from '@/pages/public/not-found';
import ProfilePage from './pages/users/profile';
import EditProfilePage from './pages/users/edit-profile';
import {PublicPlayground, PrivatePlayground} from './pages/private/playground';
import UserDetailPage from './pages/admin/users/user-details';
import UserListPage from './pages/admin/users/users-page';
import ProblemsPage from './pages/problems/problems-list';
import ProblemDetailPage from './pages/problems/problem-page';
import { AuthProvider } from '@/context/useAuth';
import { Toaster } from 'sonner';

const App = () => {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <AuthProvider>
                <BrowserRouter>
                    <Toaster />
                    <Navigation />
                    <Routes>
                        <Route path='/' element={<Landing />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/playground' element={<PublicPlayground />} />
                        <Route path='/private' element={<PrivatePlayground />} />
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/edit-profile' element={<EditProfilePage />} />
                        <Route path='/admin/users' element={<UserListPage />} />
                        <Route path='/admin/users/:id' element={<UserDetailPage />} />
                        <Route path='/problems' element={<ProblemsPage />} />
                        <Route path='/problems/:id' element={<ProblemDetailPage />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};



export default App;