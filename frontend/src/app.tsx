import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import NavigationBar from '@/components/nav-bar';
import Footer from '@/components/footer';
import { AuthProvider } from '@/context/useAuth';
import { Toaster } from 'sonner';
import { Loading } from './components/ui/loading';
import routes from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getCurrentUser } from './client';

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn: async () => {
                    return await getCurrentUser();
                }
            }
        }
    })
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Toaster richColors closeButton />
                        <NavigationBar />
                        <Suspense fallback={<Loading />}>
                            <RoutesWrapper />
                        </Suspense>
                        <Footer />
                    </BrowserRouter>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

const RoutesWrapper = () => {
    const routing = useRoutes(routes);
    return routing;
}



export default App;