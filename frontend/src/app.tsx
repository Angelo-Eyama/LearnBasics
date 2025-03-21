import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/nav-bar';
import Footer from '@/components/footer';
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Home from '@/pages/home';
import Register from '@/pages/sign-in';
import NotFound from '@/pages/not-found';
import PublicPlayground from './pages/playground';
import { AuthProvider } from '@/context/useAuth';

const App = () => {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <AuthProvider>
                <BrowserRouter>
                    <Navigation />
                    <Routes>
                        <Route path='/' element={<Landing />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/playground' element={<PublicPlayground />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};



export default App;