import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/nav-bar';
import Footer from '@/components/footer';
import { AuthProvider } from '@/context/useAuth';
import { Toaster } from 'sonner';
import { Loading } from './components/ui/loading';
import routes from '@/routes';

const App = () => {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <AuthProvider>
                <BrowserRouter>
                    <Toaster richColors closeButton/>
                    <Navigation />
                    <Suspense fallback={<Loading />}>
                        <RoutesWrapper />
                    </Suspense>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};

const RoutesWrapper = () => {
    const routing = useRoutes(routes);
    return routing;
}



export default App;